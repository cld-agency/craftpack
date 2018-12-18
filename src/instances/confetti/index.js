/**
 * External
 */
import Vue from 'vue';

/**
 * Internal
 */
import confetti from './confetti.vue';

if (document.getElementById('app')) {
    new Vue({
        el: '#app',
        render: h => h(confetti),
    });
}
