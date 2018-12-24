/**
 * Configure PostCSS goodness.
 *
 * @type {Object}
 */
module.exports = {
    plugins: [
        require('tailwindcss')('./tailwind.config.js'),
        require('autoprefixer'),
    ],
    sourceMap: true,
    syntax: 'postcss-scss',
};
