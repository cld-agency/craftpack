// Dev builds
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// Node modules
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

// Webpack plugins
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const dashboard = new Dashboard();
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

// Configuration
const common = require('./webpack.common.js');
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

/**
 * Configure Webpack Dev Serverm which we use for HMR and quicker development
 * builds.
 *
 * @param {String} _buildType
 *
 * @return {Object}
 */
const configureDevServer = (_buildType) => {
    return {
        contentBase: path.resolve(__dirname, settings.paths.templates),
        disableHostCheck: true,
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

/**
 * In production we automatically minify images, but in development we don't
 * want to do that as it's a real time sink. Just move them.
 *
 * @param {String} _buildType
 *
 * @return {Object}
 */
const configureImageLoader = (_buildType) => {
    return {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
            {
                loader: 'file-loader',
                options: { name: 'img/[name].[hash].[ext]' }
            }
        ]
    };
};

/**
 * Makes the Sass source usable in the browser. In development we don't build it
 * into it's own file, we just inject it with JS as it's quicker.
 *
 * @param {String} buildType
 *
 * @return {Object}
 */
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

/**
 * Bring it all together.
 *
 * @type {Array}
 */
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
