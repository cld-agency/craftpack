/**
 * External
 *
 * Add Promise and Iterator polyfills.
 * See: https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import#working-with-webpack-and-babel-preset-env
 */
import 'core-js/modules/es6.promise';
import 'core-js/modules/es6.array.iterator';

/**
 * Internal
 */
import '../css/style.scss';

/**
 * Display Confetti.
 */
const main = async () => {
	const Vue = await import(/* webpackChunkName: "vue" */ 'vue');
	new Vue.default({
		el: '#app',
		components: {
			'confetti': () => import(/* webpackChunkName: "confetti" */ '../vue/Confetti.vue'),
		},
	});
};


// Execute async function
main().then((_value) => {
	console.log('Hi');
});
