'use strict';

/**
 * External
 */
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
var WebpackNotifierPlugin = require('webpack-notifier');

/**
 * Configure Webpack Dev Server.
 *
 * @return {Object}
 */
const configureDevServer = () => {
    return {
        allowedHosts: [ '.test' ],
        headers: { 'Access-Control-Allow-Origin': '*' },
        overlay: true,
        publicPath: 'http://localhost:8080/web/dist/',
        stats: 'errors-only'
    };
};

/**
 * The Vue loader
 *
 * @returns {Object}
 */
const configureVueLoader = () => {
    return {
        test: /\.vue$/,
        loader: 'vue-loader'
    };
};

/**
 * The style loader.
 *
 * @returns {Object}
 */
const configureStyleLoader = () => {
    return {
        test: /\.s[c|a]ss$/,
        use: [
            'style-loader',
            'css-loader',
            'sass-loader',
        ]
    };
};

/**
 * The config object.
 */
module.exports = {
    devServer: configureDevServer(),
    mode: 'development',
    module: {
        rules: [ configureVueLoader(), configureStyleLoader() ]
    },
    output: {
        filename: 'js/app.js',
        path: __dirname + '/web/dist',
    },
    plugins: [
        new CaseSensitivePathsPlugin(),
        new VueLoaderPlugin(),
        new WebpackNotifierPlugin({
            alwaysNotify: true,
            excludeWarnings: true,
            title: 'Webpack',
        }),
    ]
};
