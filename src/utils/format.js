export const formatDate = (date, opts = {}) => {
    if (!date) return '—';
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...opts,
    });
};

export const formatDateTime = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatCurrency = (value) => {
    const n = Number(value) || 0;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(n);
};

export const formatNumber = (value) => {
    const n = Number(value) || 0;
    return new Intl.NumberFormat('en-US').format(n);
};

export const initials = (name = '') =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() || '')
        .join('');

export const avatarColor = (seed = '') => {
    const palette = [
        'bg-blue-500',
        'bg-emerald-500',
        'bg-amber-500',
        'bg-rose-500',
        'bg-violet-500',
        'bg-cyan-500',
        'bg-indigo-500',
        'bg-teal-500',
    ];
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % palette.length;
    return palette[h];
};

export const daysBetween = (a, b) => {
    const d1 = new Date(a);
    const d2 = new Date(b);
    if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return 0;
    return Math.max(0, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);
};

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const isSameDay = (a, b) => {
    const d1 = new Date(a);
    const d2 = new Date(b);
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
};

export const downloadCSV = (filename, rows, headers) => {
    if (!rows || !rows.length) return;
    const cols = headers || Object.keys(rows[0]);
    const escape = (v) => {
        const s = v == null ? '' : String(v);
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
        cols.join(','),
        ...rows.map((r) => cols.map((c) => escape(r[c])).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};