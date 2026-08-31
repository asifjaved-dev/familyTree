import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';

const GENDER_LABEL = { M: 'Male', F: 'Female', O: 'Other' };

const GENDER_BADGE = {
    F: 'bg-pink-100 text-pink-700',
    M: 'bg-blue-100 text-blue-700',
};

const PAGE_SIZE = 10;

export default function FamilyList({ people }) {
    const [query, setQuery] = useState('');
    const [gender, setGender] = useState('');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return people.filter((person) => {
            const matchesName = !q || person.name.toLowerCase().includes(q);
            const matchesGender = !gender || person.gender === gender;
            return matchesName && matchesGender;
        });
    }, [people, query, gender]);

    const hasFilters = query.trim() !== '' || gender !== '';

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // Jump back to page 1 whenever the filters change so the visible
    // page always matches the new result set.
    useEffect(() => {
        setPage(1);
    }, [query, gender]);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-900">
                        Family List
                    </h2>
                    <p className="mt-0.5 text-sm text-gray-500">
                        Everyone in your family tree, in one list.
                    </p>
                </div>
            }
        >
            <Head title="Family List" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-3">
                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                                {filtered.length} of {people.length} {people.length === 1 ? 'person' : 'people'}
                            </span>
                            <div className="flex items-center gap-2">
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="rounded-lg border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All genders</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                </select>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by name…"
                                    className="w-56 rounded-lg border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {hasFilters && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setQuery('');
                                            setGender('');
                                        }}
                                        className="text-sm font-medium text-gray-500 hover:text-gray-700"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {people.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <UsersIcon className="mx-auto h-10 w-10 text-gray-300" />
                                <p className="mt-3 text-sm text-gray-500">
                                    No one in your tree yet.{' '}
                                    <Link href={route('dashboard')} className="font-medium text-indigo-600 hover:underline">
                                        Start your family tree
                                    </Link>
                                    .
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100 text-sm">
                                        <thead>
                                            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                <th className="px-5 py-3">Name</th>
                                                <th className="px-5 py-3">Gender</th>
                                                <th className="px-5 py-3">Father</th>
                                                <th className="px-5 py-3">Birthday</th>
                                                <th className="px-5 py-3">Death date</th>
                                                <th className="px-5 py-3">Relatives</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {paged.map((person) => (
                                                <tr key={person.id} className="hover:bg-gray-50">
                                                    <td className="whitespace-nowrap px-5 py-3 font-medium text-gray-900">
                                                        {person.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-3">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                GENDER_BADGE[person.gender] ?? 'bg-gray-100 text-gray-600'
                                                            }`}
                                                        >
                                                            {GENDER_LABEL[person.gender] ?? 'Unspecified'}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                                                        {person.fatherName || '—'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                                                        {person.birthday || '—'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                                                        {person.deathday || '—'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                                                        {person.relativeCount}
                                                    </td>
                                                </tr>
                                            ))}

                                            {filtered.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                                                        No one matches these filters.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {pageCount > 1 && (
                                    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
                                        <p className="text-sm text-gray-500">
                                            Page {currentPage} of {pageCount}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                disabled={currentPage === 1}
                                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <ChevronLeftIcon className="h-4 w-4" />
                                                Previous
                                            </button>
                                            <button
                                                type="button"
                                                disabled={currentPage === pageCount}
                                                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                                                className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Next
                                                <ChevronRightIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
