'use strict';

const DashboardPlugin = require('webpack-dashboard/plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    entry: './src/js/app.js',
    mode: 'development',
    module: {
        rules: [{
            test: /\.vue$/,
            use: 'vue-loader'
        }, {
            test: /\.js$/,
            use: 'babel-loader'
        }, {
            test: /\.s[c|a]ss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }]
    },
    output: {
        path: __dirname + '/web/dist',
        filename: 'js/app.js'
    },
    plugins: [
        new DashboardPlugin(),
        new VueLoaderPlugin(),
    ]
};
