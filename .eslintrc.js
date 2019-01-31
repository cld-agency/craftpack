module.exports = {
	'env': {
		'browser': true,
		'es6': true
	},
	'extends': 'eslint:recommended',
	'parser': 'babel-eslint',
	'parserOptions': {
		'ecmaVersion': 2017,
		'sourceType': 'module'
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};
