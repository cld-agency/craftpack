// App main
const main = async () => {
    // Import our CSS
    const _styles = await import(/* webpackChunkName: "styles" */ '../css/style.scss');

    // Async load the vue module
    const Vue = await import(/* webpackChunkName: "vue" */ 'vue');

    // Create our vue instance
    const _vm = new Vue.default({
        el: "#app",
        components: {
            'confetti': () => import(/* webpackChunkName: "confetti" */ '../vue/Confetti.vue'),
        },
    });
};

// Execute async function
main().then((_value) => { });
