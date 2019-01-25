// webpack.common.js - common webpack config
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// node modules
const path = require('path');
const merge = require('webpack-merge');

// webpack plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// config files
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

// Configure Babel loader
const configureBabelLoader = (browserList) => {
	return {
		test: /\.js$/,
		exclude: /node_modules/,
		use: {
			loader: 'babel-loader',
			options: {
				presets: [
					[
						'@babel/preset-env', {
							modules: false,
							useBuiltIns: 'entry',
							targets: { browsers: browserList },
						}
					],
				],
				plugins: [
					[
						'@babel/plugin-transform-runtime', {
							'regenerator': true,
						}
					],
					[ '@babel/plugin-syntax-dynamic-import' ],
				],
			},
		},
	};
};

// Configure Entries
const configureEntries = () => {
	let entries = {};

	// Add Promise and Iterator polyfills.
	// See: https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import#working-with-webpack-and-babel-preset-env
	// TODO: This will include the polyfills in our modern build. Can this
	//       function be tweaked to accept a modern/legacy argument?
	entries['es6.promise'] = 'core-js/modules/es6.promise';
	entries['es6.array.iterator'] = 'core-js/modules/es6.array.iterator';

	for (const [key, value] of Object.entries(settings.entries)) {
		entries[key] = path.resolve(__dirname, settings.paths.src.js + value);
	}

	return entries;
};

// Configure Font loader
const configureFontLoader = () => {
	return {
		test: /\.(ttf|eot|woff2?)$/i,
		use: [
			{
				loader: 'file-loader',
				options: { name: 'fonts/[name].[ext]' }
			}
		]
	};
};

// Configure Manifest
const configureManifest = (fileName) => {
	return {
		fileName: fileName,
		basePath: settings.manifestConfig.basePath,
		map: (file) => {
			file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, '$2');
			return file;
		},
	};
};

// Configure Vue loader
const configureVueLoader = () => {
	return {
		test: /\.vue$/,
		loader: 'vue-loader',
	};
};

// The base webpack config
const baseConfig = {
	name: pkg.name,
	entry: configureEntries(),
	output: {
		path: path.resolve(__dirname, settings.paths.dist.base),
		publicPath: settings.urls.publicPath
	},
	resolve: {
		alias: { 'vue$': 'vue/dist/vue.esm.js' },
	},
	module: {
		rules: [
			configureFontLoader(),
			configureVueLoader(),
		],
	},
	plugins: [ new VueLoaderPlugin() ]
};

// Legacy webpack config
const legacyConfig = {
	module: {
		rules: [ configureBabelLoader(Object.values(pkg.browserslist)) ],
	},
	plugins: [
		new CopyWebpackPlugin(settings.copyWebpackConfig),
		new ManifestPlugin(configureManifest('manifest-legacy.json')),
	],
};

// Modern webpack config
const modernConfig = {
	module: {
		rules: [
			configureBabelLoader(Object.values(pkg.browserslist)),
		],
	},
	plugins: [
		new ManifestPlugin(configureManifest('manifest.json')),
	],
};

// Common module exports
// noinspection WebpackConfigHighlighting
module.exports = {
	'legacyConfig': merge(legacyConfig, baseConfig),
	'modernConfig': merge(modernConfig, baseConfig),
};
