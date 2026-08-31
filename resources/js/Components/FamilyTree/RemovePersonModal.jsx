import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { personFullName } from './utils';

export default function RemovePersonModal({ person, onCancel, onConfirm }) {
    const open = !!person;
    const fullName = personFullName(person?.data);

    return (
        <Transition show={open} as={Fragment}>
            <Dialog className="relative z-50" onClose={onCancel}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/40" />
                </TransitionChild>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <DialogTitle className="mt-4 text-base font-semibold text-gray-900">
                                Remove {fullName}?
                            </DialogTitle>
                            <p className="mt-2 text-sm text-gray-500">
                                This removes them from the family tree. If
                                other relatives would otherwise lose their
                                connection to the tree, they&apos;re kept as
                                an unlinked placeholder instead of being
                                deleted.
                            </p>
                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
