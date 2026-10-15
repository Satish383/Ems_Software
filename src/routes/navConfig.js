import {
    LayoutDashboard, Users, Building2, BadgeCheck, CalendarCheck,
    ClipboardList, Wallet, TrendingUp, FileBarChart, Bell, Settings, User,
} from 'lucide-react';

export const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Employees', path: '/employees', icon: Users },
    { label: 'Departments', path: '/departments', icon: Building2 },
    { label: 'Designations', path: '/designations', icon: BadgeCheck },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'Leave Management', path: '/leaves', icon: ClipboardList },
    { label: 'Payroll', path: '/payroll', icon: Wallet },
    { label: 'Performance', path: '/performance', icon: TrendingUp },
    { label: 'Reports', path: '/reports', icon: FileBarChart },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Settings', path: '/settings', icon: Settings },
];

export const profileItems = [
    { label: 'My Profile', path: '/my-profile', icon: User },
];