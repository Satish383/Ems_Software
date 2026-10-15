/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                navy: {
                    DEFAULT: '#172554',
                    50: '#F0F4FF',
                    100: '#E0E9FF',
                    200: '#C1D3FF',
                    300: '#A2BDFF',
                    400: '#648DFA',
                    500: '#3B82F6',
                    600: '#2563EB',
                    700: '#1D4ED8',
                    800: '#1E3A8A',
                    900: '#172554',
                },
                accent: '#3B82F6',
                surface: '#F8FAFC',
                card: '#FFFFFF',
                ink: '#0F172A',
                muted: '#64748B',
                success: '#16A34A',
                warning: '#D97706',
                danger: '#DC2626',
                border: '#E2E8F0',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            borderRadius: {
                card: '14px',
            },
            boxShadow: {
                card: '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.06)',
                elevated: '0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
                popover: '0 20px 40px -12px rgba(15, 23, 42, 0.18)',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(4px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in-right': {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                'slide-in-left': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.97)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.2s ease-out',
                'slide-in-right': 'slide-in-right 0.25s ease-out',
                'slide-in-left': 'slide-in-left 0.25s ease-out',
                'scale-in': 'scale-in 0.15s ease-out',
                'shimmer': 'shimmer 1.5s linear infinite',
            },
        },
    },
    plugins: [],
};