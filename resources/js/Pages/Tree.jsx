import FamilyTree from '@/Components/FamilyTree';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, router, useForm } from '@inertiajs/react';

export default function Tree({ tree }) {
    const hasPeople = tree.length > 0;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Family Tree
                </h2>
            }
        >
            <Head title="Family Tree" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        {hasPeople ? (
                            <FamilyTree data={tree} />
                        ) : (
                            <StartTreeForm />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StartTreeForm() {
    const { data, setData, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        gender: 'M',
    });

    function submit(e) {
        e.preventDefault();

        const id = crypto.randomUUID();

        router.put(
            route('tree.sync'),
            {
                people: [
                    {
                        id,
                        data: {
                            'first name': data.first_name,
                            'last name': data.last_name,
                            gender: data.gender,
                        },
                        rels: { spouses: [], children: [] },
                    },
                ],
            },
            { preserveScroll: true },
        );
    }

    return (
        <div className="mx-auto max-w-md py-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">
                Start your family tree
            </h3>
            <p className="mt-1 text-sm text-gray-500">
                Add yourself first — you'll be able to add parents, spouses
                and children directly on the tree afterwards.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4 text-left">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        First name
                    </label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                    />
                    {errors.first_name && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.first_name}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Last name
                    </label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Gender
                    </label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        value={data.gender}
                        onChange={(e) => setData('gender', e.target.value)}
                    >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                    </select>
                </div>

                <PrimaryButton disabled={processing}>
                    Create my tree
                </PrimaryButton>
            </form>
        </div>
    );
}
