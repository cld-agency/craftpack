/**
 * External
 */
import Vue from 'vue';
import confetti from '../vue/Confetti.vue';

/**
 * Internal
 */
import '../css/style.scss';

if (document.getElementById('app')) {
	new Vue({
		el: '#app',
		render: h => h(confetti),
	});
}
