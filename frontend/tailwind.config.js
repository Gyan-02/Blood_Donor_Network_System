/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'blood-red': '#E63946',
                'medical-blue': '#457B9D',
            },
        },
    },
    plugins: [],
}
