import {
    PencilSquareIcon,
    TrashIcon,
    UserPlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { personFullName, personInitials } from './utils';

const GENDER_LABEL = { M: 'Male', F: 'Female', O: 'Other' };

const GENDER_BADGE = {
    F: 'bg-pink-100 text-pink-700',
    M: 'bg-blue-100 text-blue-700',
};

/**
 * Non-modal by design: no backdrop, so the tree behind it stays clickable
 * and clicking a different card just swaps the panel's content in place
 * instead of forcing the user to close it first.
 */
export default function PersonDetailsPanel({
    person,
    relatives,
    readOnly = false,
    onClose,
    onEdit,
    onAddRelative,
    onRemove,
}) {
    const open = !!person;

    // Keep showing the last selected person's details while the panel
    // fades out, instead of blanking to empty fields mid-animation.
    const [shown, setShown] = useState({ person, relatives });
    useEffect(() => {
        if (person) setShown({ person, relatives });
    }, [person, relatives]);

    const data = shown.person?.data ?? {};
    const fullName = personFullName(data);

    return (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-30 flex max-w-full">
            <Transition
                as={Fragment}
                show={open}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
            >
                <TransitionChild
                    as="div"
                    role="dialog"
                    aria-label={`${fullName} details`}
                    // Only interactive while actually open — while fading out
                    // on close, clicks must pass through to whatever family-chart
                    // opens in the same screen area (e.g. its own edit form).
                    className={`w-screen max-w-xs ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
                >
                    <div className="flex h-full flex-col overflow-y-auto bg-white shadow-2xl ring-1 ring-black/5">
                        <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-8 text-white">
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute right-4 top-4 rounded-full p-1 text-indigo-100 transition hover:bg-white/10 hover:text-white"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-xl font-semibold ring-2 ring-white/40">
                                    {data.avatar ? (
                                        <img
                                            src={data.avatar}
                                            alt={fullName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        personInitials(data)
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">{fullName}</h2>
                                    <span
                                        className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                            GENDER_BADGE[data.gender] ?? 'bg-white/20 text-white'
                                        }`}
                                    >
                                        {GENDER_LABEL[data.gender] ?? 'Unspecified'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-6 px-6 py-6">
                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="font-medium text-gray-500">Birthday</dt>
                                    <dd className="mt-0.5 text-gray-900">
                                        {data.birthday || '—'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-500">Death date</dt>
                                    <dd className="mt-0.5 text-gray-900">
                                        {data.deathday || '—'}
                                    </dd>
                                </div>
                            </dl>

                            {shown.relatives.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Relatives
                                    </h3>
                                    <ul className="mt-2 space-y-1.5">
                                        {shown.relatives.map((rel) => (
                                            <li
                                                key={rel.id}
                                                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                                            >
                                                <span className="text-gray-700">{rel.name}</span>
                                                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                    {rel.label}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {!readOnly && (
                            <div className="space-y-2 border-t border-gray-100 px-6 py-5">
                                <button
                                    type="button"
                                    onClick={() => onEdit(shown.person)}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                                >
                                    <PencilSquareIcon className="h-4 w-4" />
                                    Edit details
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onAddRelative(shown.person)}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    <UserPlusIcon className="h-4 w-4" />
                                    Add relative
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onRemove(shown.person)}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    Remove from tree
                                </button>
                            </div>
                        )}
                    </div>
                </TransitionChild>
            </Transition>
        </div>
    );
}
