// webpack.settings.js - webpack settings config

// node modules
require('dotenv').config();

// Webpack settings exports
// noinspection WebpackConfigHighlighting
module.exports = {
    name: "Craftpack",
    copyright: "CLD",
    paths: {
        src: {
            base: "./src/",
            css: "./src/css/",
            js: "./src/js/"
        },
        dist: {
            base: "./web/dist/",
            clean: [
                "./img",
                "./css",
                "./js"
            ]
        },
        templates: "./templates/"
    },
    urls: {
        live: "https://craftpack.com/",
        local: "http://craftpack.test/",
        publicPath: "/dist/"
    },
    vars: { cssName: "styles" },
    entries: { "app": "app.js" },
    devServerConfig: {
        public: () => process.env.DEVSERVER_PUBLIC || "http://localhost:8080",
        host: () => process.env.DEVSERVER_HOST || "localhost",
        poll: () => process.env.DEVSERVER_POLL || false,
        port: () => process.env.DEVSERVER_PORT || 8080,
        https: () => process.env.DEVSERVER_HTTPS || false,
    },
    manifestConfig: { basePath: "" },
    purgeCssConfig: {
        paths: [
            "./templates/**/*.{twig,html}",
            "./src/vue/**/*.{vue,html}"
        ],
        whitelist: [ "./src/css/components/**/*.css" ],
        whitelistPatterns: [],
        extensions: [
            "html",
            "js",
            "twig",
            "vue"
        ]
    },
    saveRemoteFileConfig: [
        {
            url: "https://www.google-analytics.com/analytics.js",
            filepath: "js/analytics.js"
        }
    ],
    createSymlinkConfig: [
        {
            origin: "img/favicons/favicon.ico",
            symlink: "../favicon.ico"
        }
    ],
    webappConfig: {
        logo: "./src/img/favicon-src.png",
        prefix: "img/favicons/"
    },
};
