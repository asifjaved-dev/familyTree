import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';

function initials(name = '') {
    return (
        name
            .trim()
            .split(/\s+/)
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || '?'
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <Link href="/" className="flex shrink-0 items-center gap-2">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600">
                                    <ApplicationLogo className="h-5 w-5 fill-current text-white" />
                                </span>
                                <span className="hidden text-base font-semibold text-gray-900 sm:block">
                                    FamilyTree
                                </span>
                            </Link>

                            <div className="hidden space-x-1 sm:-my-px sm:ms-10 sm:flex sm:items-center">
                                <NavLink
                                    href={route('home')}
                                    active={route().current('home')}
                                >
                                    Family Tree
                                </NavLink>
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Manage Tree
                                </NavLink>
                                <NavLink
                                    href={route('familylist')}
                                    active={route().current('familylist')}
                                >
                                    Family List
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <Menu as="div" className="relative">
                                <MenuButton className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                                        {initials(user.name)}
                                    </span>
                                    {user.name}
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                </MenuButton>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-150"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <MenuItems className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                        <MenuItem>
                                            {({ focus }) => (
                                                <Link
                                                    href={route('profile.edit')}
                                                    className={`block px-4 py-2 text-sm text-gray-700 ${focus ? 'bg-gray-50' : ''}`}
                                                >
                                                    Profile
                                                </Link>
                                            )}
                                        </MenuItem>
                                        <MenuItem>
                                            {({ focus }) => (
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className={`block w-full px-4 py-2 text-start text-sm text-gray-700 ${focus ? 'bg-gray-50' : ''}`}
                                                >
                                                    Log Out
                                                </Link>
                                            )}
                                        </MenuItem>
                                    </MenuItems>
                                </Transition>
                            </Menu>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                            >
                                {showingNavigationDropdown ? (
                                    <XMarkIcon className="h-6 w-6" />
                                ) : (
                                    <Bars3Icon className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('home')}
                            active={route().current('home')}
                        >
                            Family Tree
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Manage Tree
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('familylist')}
                            active={route().current('familylist')}
                        >
                            Family List
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="flex items-center gap-3 px-4">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                                {initials(user.name)}
                            </span>
                            <div>
                                <div className="text-base font-medium text-gray-800">
                                    {user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {user.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
