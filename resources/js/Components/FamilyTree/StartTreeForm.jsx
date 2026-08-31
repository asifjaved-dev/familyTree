import PrimaryButton from '@/Components/PrimaryButton';
import { router, useForm } from '@inertiajs/react';
import { UsersIcon } from '@heroicons/react/24/outline';

export default function StartTreeForm() {
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
        <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                <UsersIcon className="h-6 w-6 text-indigo-600" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
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
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Gender
                    </label>
                    <select
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={data.gender}
                        onChange={(e) => setData('gender', e.target.value)}
                    >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                    </select>
                </div>

                <PrimaryButton disabled={processing} className="w-full justify-center">
                    Create my tree
                </PrimaryButton>
            </form>
        </div>
    );
}
