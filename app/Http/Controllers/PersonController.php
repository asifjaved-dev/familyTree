<?php

namespace App\Http\Controllers;

use App\Models\Person;
use Illuminate\Foundation\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class PersonController extends Controller
{
    /**
     * The site root: a read-only overview of the signed-in user's tree,
     * or the marketing page for guests.
     */
    public function home(): Response
    {
        if (! Auth::check()) {
            return Inertia::render('Welcome', [
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
                'laravelVersion' => Application::VERSION,
                'phpVersion' => PHP_VERSION,
            ]);
        }

        return Inertia::render('Home', [
            'tree' => $this->currentUserTree(),
        ]);
    }

    /**
     * Show the current user's tree on the dashboard, rendered with family-chart.js.
     */
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'tree' => $this->currentUserTree(),
        ]);
    }

    private function currentUserTree()
    {
        return Auth::user()->people()->get()
            ->map(fn (Person $person) => $person->toTreeNode())
            ->values();
    }

    /**
     * A flat, sortable listing of everyone in the current user's tree.
     */
    public function list(): Response
    {
        $people = Auth::user()->people()->get();

        $names = $people->mapWithKeys(function (Person $person) {
            $name = trim(($person->data['first name'] ?? '').' '.($person->data['last name'] ?? ''));

            return [$person->id => $name !== '' ? $name : 'Unnamed'];
        });

        $rows = $people->map(function (Person $person) use ($names) {
            $fatherId = $person->rels['father'] ?? null;

            return [
                'id' => $person->id,
                'name' => $names[$person->id],
                'gender' => $person->data['gender'] ?? null,
                'birthday' => $person->data['birthday'] ?? null,
                'deathday' => $person->data['deathday'] ?? null,
                'fatherName' => $fatherId ? ($names[$fatherId] ?? null) : null,
                'relativeCount' => count($person->rels['spouses'] ?? [])
                    + count($person->rels['children'] ?? [])
                    + (isset($person->rels['father']) ? 1 : 0)
                    + (isset($person->rels['mother']) ? 1 : 0),
            ];
        })
            ->sortBy('name')
            ->values();

        return Inertia::render('FamilyList', [
            'people' => $rows,
        ]);
    }

    /**
     * Persist the whole tree as produced by family-chart.js after an
     * add/edit/remove-relative action. The client always sends the full,
     * current dataset, so we upsert what's present and drop what isn't.
     */
    public function sync(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'people' => ['present', 'array'],
            'people.*.id' => ['required', 'string'],
            'people.*.data' => ['present', 'array'],
            'people.*.rels' => ['present', 'array'],
        ]);

        $userId = Auth::id();

        DB::transaction(function () use ($validated, $userId) {
            $incomingIds = collect($validated['people'])->pluck('id');

            Person::where('user_id', $userId)
                ->whereNotIn('id', $incomingIds)
                ->delete();

            foreach ($validated['people'] as $node) {
                Person::updateOrCreate(
                    ['id' => $node['id'], 'user_id' => $userId],
                    ['data' => $node['data'], 'rels' => $node['rels']]
                );
            }
        });

        return back();
    }
}
