// webpack.dev.js - developmental builds
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// node modules
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

// webpack plugins
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const dashboard = new Dashboard();
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

// config files
const common = require('./webpack.common.js');
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

// Configure the webpack-dev-server
const configureDevServer = (_buildType) => {
    return {
        contentBase: path.resolve(__dirname, settings.paths.templates),
        headers: { 'Access-Control-Allow-Origin': '*' },
        host: settings.devServerConfig.host(),
        hot: true,
        hotOnly: true,
        https: !!parseInt(settings.devServerConfig.https()),
        overlay: true,
        port: settings.devServerConfig.port(),
        public: settings.devServerConfig.public(),
        quiet: true,
        stats: 'errors-only',
        watchOptions: {
            poll: !!parseInt(settings.devServerConfig.poll()),
            ignored: /node_modules/,
        },
    };
};

// Configure Image loader
const configureImageLoader = (buildType) => {
    if (buildType === LEGACY_CONFIG) {
        return {
            test: /\.(png|jpe?g|gif|svg|webp)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: { name: 'img/[name].[hash].[ext]' }
                }
            ]
        };
    }
    if (buildType === MODERN_CONFIG) {
        return {
            test: /\.(png|jpe?g|gif|svg|webp)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: { name: 'img/[name].[hash].[ext]' }
                }
            ]
        };
    }
};

// Configure the Postcss loader
const configureSassCssLoader = (buildType) => {
    // Don't generate CSS for the legacy config in development
    if (buildType === LEGACY_CONFIG) {
        return {
            test: /\.s[c|a]ss$/,
            loader: 'ignore-loader'
        };
    }
    if (buildType === MODERN_CONFIG) {
        return {
            test: /\.s[c|a]ss$/,
            use: [
                { loader: 'style-loader' },
                { loader: 'vue-style-loader' },
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2,
                        sourceMap: true
                    }
                }, {
                    loader: 'sass-loader',
                    options: { sourceMap: true }
                }
            ]
        };
    }
};

// Development module exports
module.exports = [
    merge(
        common.legacyConfig,
        {
            output: {
                filename: path.join('./js', '[name]-legacy.[hash].js'),
                publicPath: settings.devServerConfig.public() + '/',
            },
            mode: 'development',
            devtool: 'inline-source-map',
            devServer: configureDevServer(LEGACY_CONFIG),
            module: {
                rules: [
                    configureSassCssLoader(LEGACY_CONFIG),
                    configureImageLoader(LEGACY_CONFIG),
                ],
            },
            plugins: [
                new HardSourceWebpackPlugin(),
                new webpack.HotModuleReplacementPlugin(),
            ],
        }
    ),
    merge(
        common.modernConfig,
        {
            output: {
                filename: path.join('./js', '[name].[hash].js'),
                publicPath: settings.devServerConfig.public() + '/',
            },
            mode: 'development',
            devtool: 'inline-source-map',
            devServer: configureDevServer(MODERN_CONFIG),
            module: {
                rules: [
                    configureSassCssLoader(MODERN_CONFIG),
                    configureImageLoader(MODERN_CONFIG),
                ],
            },
            plugins: [
                new DashboardPlugin(dashboard.setData),
                new HardSourceWebpackPlugin(),
                new webpack.HotModuleReplacementPlugin(),
            ],
        }
    ),
];
