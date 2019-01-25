/**
 * External
 */

/**
 * Internal
 */
import '../css/style.scss';

const main = async () => {
	const Vue = await import(/* webpackChunkName: "vue" */ 'vue');
	const vm  = new Vue.default({
		el: "#app",
		components: {
			'confetti': () => import(/* webpackChunkName: "confetti" */ '../vue/Confetti.vue'),
		},
	});
};

// Execute async function
main().then((value) => {
	//
});
