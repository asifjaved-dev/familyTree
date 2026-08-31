<?php

namespace App\Http\Controllers;

use App\Models\Person;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PersonController extends Controller
{
    /**
     * Show the current user's tree, rendered with family-chart.js.
     */
    public function index(): Response
    {
        $tree = Auth::user()->people()->get()
            ->map(fn (Person $person) => $person->toTreeNode())
            ->values();

        return Inertia::render('Tree', [
            'tree' => $tree,
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
