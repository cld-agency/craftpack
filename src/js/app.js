import styles from '../css/app.scss';

// App main
const main = async () => {
    // Async load the vue module
    const Vue = await import(/* webpackChunkName: "vue" */ 'vue');
    // Create our vue instance
    const vm = new Vue.default({
        el: "#app",
        components: {
            'confetti': () => import(/* webpackChunkName: "confetti" */ '../vue/Confetti.vue'),
        },
        data: {
        },
        methods: {
        },
        mounted() {
        },
    });
};
// Execute async function
main().then( (value) => {
});
