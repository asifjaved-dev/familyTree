export function personFullName(data = {}) {
    return [data['first name'], data['last name']].filter(Boolean).join(' ').trim() || 'Unnamed';
}

export function personInitials(data = {}) {
    return (
        [data['first name'], data['last name']]
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .toUpperCase() || '?'
    );
}
