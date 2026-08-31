import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700') +
                ' ' +
                className
            }
        >
            {children}
        </Link>
    );
}
