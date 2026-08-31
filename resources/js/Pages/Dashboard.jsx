import FamilyTree, { StartTreeForm } from '@/Components/FamilyTree';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ tree }) {
    const hasPeople = tree.length > 0;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-900">
                        Manage Tree
                    </h2>
                    <p className="mt-0.5 text-sm text-gray-500">
                        Add, edit and remove people in your family tree.
                    </p>
                </div>
            }
        >
            <Head title="Manage Tree" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {hasPeople ? (
                        <FamilyTree data={tree} />
                    ) : (
                        <div className="py-12">
                            <StartTreeForm />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
