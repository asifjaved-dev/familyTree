import FamilyTree from '@/Components/FamilyTree';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link } from '@inertiajs/react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

export default function Home({ tree }) {
    const hasPeople = tree.length > 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-900">
                            Family Tree
                        </h2>
                        <p className="mt-0.5 text-sm text-gray-500">
                            A read-only overview — head to Manage Tree to make changes.
                        </p>
                    </div>
                    {hasPeople && (
                        <Link href={route('dashboard')}>
                            <PrimaryButton>
                                <PencilSquareIcon className="mr-1.5 h-4 w-4" />
                                Manage Tree
                            </PrimaryButton>
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Family Tree" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {hasPeople ? (
                        <FamilyTree data={tree} readOnly />
                    ) : (
                        <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900">
                                No family tree yet
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Head to Manage Tree to add the first person.
                            </p>
                            <Link href={route('dashboard')} className="mt-6 inline-block">
                                <PrimaryButton>
                                    <PencilSquareIcon className="mr-1.5 h-4 w-4" />
                                    Manage Tree
                                </PrimaryButton>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
