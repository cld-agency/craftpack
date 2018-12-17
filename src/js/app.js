/**
 * External
 */
import Vue from 'vue';

/**
 * Internal
 */
import confetti from '../vue/Confetti.vue';
import '../css/app.scss';

if (document.getElementById('app')) {
    new Vue({
        el: '#app',
        render: h => h(confetti),
    });
}
