

const config = {
    content: [
        './src/**/*.{ts,tsx}', // asegúrate de que esté toda tu app
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ['var(--font-mona-sans)', 'sans-serif'],
                'heading-light': ['var(--font-merriweather)', 'serif'],
                'heading-regular': ['var(--font-merriweather)', 'serif'],
                'heading-bold': ['var(--font-merriweather)', 'serif'],
                'heading-black': ['var(--font-merriweather)', 'serif'],
                body: ['var(--font-hubot-sans)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
