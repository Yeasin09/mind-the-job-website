/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0f172a', // Slate 900
                    light: '#334155', // Slate 700
                },
                secondary: {
                    DEFAULT: '#0d9488', // Teal 600
                    dark: '#0f766e', // Teal 700
                },
                accent: {
                    DEFAULT: '#6366f1', // Indigo 500
                },
                surface: {
                    DEFAULT: '#ffffff',
                    muted: '#f8fafc', // Slate 50
                },
                text: {
                    main: '#1e293b', // Slate 800
                    muted: '#64748b', // Slate 500
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
