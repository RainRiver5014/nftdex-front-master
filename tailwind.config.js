module.exports = {
    purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        boxShadow: {
            DEFAULT: "0 4px 2px -2px rgba(0, 0, 0, 0.3)"
        },
        maxHeight: {
            "1/5": "20%",
            "1/10": "10%",
            "1/2": "50%",
            "1/3": "33,33%",
        },
        backgroundColor: theme => ({
            ...theme('colors'),
            "primary": "#E2E2E2",
            "secondary": "#EBEBEB",
            "select": "#b52929",
            "drawer": "#ECECEC",
            "grey": "rgba(217, 217, 217,0.37)"
        }),
        borderColor: theme => ({
            ...theme('colors'),
            "primary": "#c1c1c1",
            "secondary": "#b52929"
        }),
        fontSize: {
            'xs': '.75rem',
            'sm': '.875rem',
            'tiny': '.875rem',
            'base': '1rem',
            'lg': '1.125rem',
            'xl': '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
            '6xl': '4rem',
            '7xl': '5rem',
            '14px': "14px",
            '12px': "12px"
        },
        textColor: theme => ({
            ...theme('colors'),
            "title": "#5c5c5c",
            "sub": "#949494",
            "sub-title": "#3f3f3f",
            "select": "#b52929",
            "primary": "rgba(0, 0, 0, 0.87)"
        }),
        gradientColorStops: theme => ({
            ...theme('colors'),
            'primary-top': '#E2E2E2',
            'primary-bottom': '#F9F9F9',
            'primary-left': '#e9e9e9',
            'primary-right': 'RGB(236, 236, 236)',
            'offer-left': '#EEEEEE',
            'offer-right': '#e9e9e9',
        })
    },
    variants: {
        extend: {
            backgroundColor: ['checked'],
            borderColor: ['checked'],
        }
    },
    plugins: [],
}
