// webpack.prod.js - production builds
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// node modules
const git = require('git-rev-sync');
const glob = require('glob-all');
const merge = require('webpack-merge');
const moment = require('moment');
const path = require('path');
const webpack = require('webpack');

// webpack plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CreateSymlinkPlugin = require('create-symlink-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const SaveRemoteFilePlugin = require('save-remote-file-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const WhitelisterPlugin = require('purgecss-whitelister');

// config files
const common = require('./webpack.common.js');
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

// Custom PurgeCSS extractor for Tailwind that allows special characters in
// class names.
//
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
    }
}

// Configure file banner
const configureBanner = () => {
    return {
        banner: [
            '/*!',
            ' * @project        ' + settings.name,
            ' * @name           ' + '[filebase]',
            ' * @author         ' + pkg.author.name,
            ' * @build          ' + moment().format('llll') + ' ET',
            ' * @release        ' + git.long() + ' [' + git.branch() + ']',
            ' * @copyright      Copyright (c) ' + moment().format('YYYY') + ' ' + settings.copyright,
            ' *',
            ' */',
            ''
        ].join('\n'),
        raw: true
    };
};

// Configure Clean webpack
const configureCleanWebpack = () => {
    return {
        root: path.resolve(__dirname, settings.paths.dist.base),
        verbose: true,
        dry: false
    };
};

// Configure Html webpack
const configureHtml = () => {
    return {
        templateContent: '',
        filename: 'webapp.html',
        inject: false,
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
                    options: {
                        name: 'img/[name].[hash].[ext]'
                    }
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
                },
                {
                    loader: 'img-loader',
                    options: {
                        plugins: [
                            require('imagemin-gifsicle')({ interlaced: true }),
                            require('imagemin-mozjpeg')({
                                progressive: true,
                                arithmetic: false,
                            }),
                            require('imagemin-optipng')({ optimizationLevel: 5 }),
                            require('imagemin-svgo')({
                                plugins: [{ convertPathData: false }]
                            }),
                        ]
                    }
                }
            ]
        };
    }
};

// Configure optimization
const configureOptimization = (buildType) => {
    if (buildType === LEGACY_CONFIG) {
        return {
            splitChunks: {
                cacheGroups: {
                    default: false,
                    common: false,
                    styles: {
                        name: settings.vars.cssName,
                        test: /\.(pcss|css|vue)$/,
                        chunks: 'all',
                        enforce: true
                    }
                }
            },
            minimizer: [
                new TerserPlugin(configureTerser()),
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        map: {
                            inline: false,
                            annotation: true,
                        },
                        safe: true,
                        discardComments: true
                    },
                })
            ]
        };
    }
    if (buildType === MODERN_CONFIG) {
        return {
            minimizer: [
                new TerserPlugin(configureTerser()),
            ]
        };
    }
};

// Configure Postcss loader
const configureSassLoader = (_buildType) => {
    return {
        test: /\.s[c|a]ss$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 2,
                    sourceMap: true
                }
            },
            { loader: 'resolve-url-loader' },
            {
                loader: 'sass-loader',
                options: { sourceMap: true }
            }
        ]
    };
};

// Configure PurgeCSS
const configurePurgeCss = () => {
    let paths = [];

    // Configure whitelist paths
    for (const [_key, value] of Object.entries(settings.purgeCssConfig.paths)) {
        paths.push(path.join(__dirname, value));
    }

    return {
        paths: glob.sync(paths),
        whitelist: WhitelisterPlugin(settings.purgeCssConfig.whitelist),
        whitelistPatterns: settings.purgeCssConfig.whitelistPatterns,
        extractors: [
            {
                extractor: TailwindExtractor,
                extensions: settings.purgeCssConfig.extensions
            }
        ]
    };
};

// Configure terser
const configureTerser = () => {
    return {
        cache: true,
        parallel: true,
        sourceMap: true
    };
};

// Configure Webapp webpack
const configureWebapp = () => {
    return {
        logo: settings.webappConfig.logo,
        prefix: settings.webappConfig.prefix,
        cache: false,
        inject: 'force',
        favicons: {
            appName: pkg.name,
            appDescription: pkg.description,
            developerName: pkg.author.name,
            developerURL: pkg.author.url,
            path: settings.paths.dist.base,
        }
    };
};

// Production module exports
module.exports = [
    merge(
        common.legacyConfig,
        {
            output: { filename: path.join('./js', '[name]-legacy.[chunkhash].js') },
            mode: 'production',
            devtool: 'source-map',
            optimization: configureOptimization(LEGACY_CONFIG),
            module: {
                rules: [
                    configureSassLoader(LEGACY_CONFIG),
                    configureImageLoader(LEGACY_CONFIG),
                ],
            },
            plugins: [
                new CleanWebpackPlugin(settings.paths.dist.clean,
                    configureCleanWebpack()
                ),
                new MiniCssExtractPlugin({
                    path: path.resolve(__dirname, settings.paths.dist.base),
                    filename: path.join('./css', '[name].[chunkhash].css'),
                }),
                new PurgecssPlugin(configurePurgeCss()),
                new webpack.BannerPlugin(configureBanner()),
                new HtmlWebpackPlugin(configureHtml()),
                new WebappWebpackPlugin(configureWebapp()),
                new CreateSymlinkPlugin(settings.createSymlinkConfig, true),
                new SaveRemoteFilePlugin(settings.saveRemoteFileConfig),
            ]
        }
    ),
    merge(
        common.modernConfig,
        {
            output: { filename: path.join('./js', '[name].[chunkhash].js') },
            mode: 'production',
            devtool: 'source-map',
            optimization: configureOptimization(MODERN_CONFIG),
            module: {
                rules: [
                    configureSassLoader(MODERN_CONFIG),
                    configureImageLoader(MODERN_CONFIG),
                ],
            },
            plugins: [
                new MiniCssExtractPlugin({
                    path: path.resolve(__dirname, settings.paths.dist.base),
                    filename: path.join('./css', '[name].[chunkhash].css'),
                }),
                new webpack.optimize.ModuleConcatenationPlugin(),
                new webpack.BannerPlugin(configureBanner()),
                new ImageminWebpWebpackPlugin(),
            ]
        }
    ),
];
