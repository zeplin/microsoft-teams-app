/* eslint-disable @typescript-eslint/no-var-requires, no-process-env */
const withSourceMaps = require("@zeit/next-source-maps")();

module.exports = withSourceMaps({
    distDir: "../../dist/client/.next",
    webpack: (config, options) => {
        // In `pages/_app.js`, Sentry is imported from @sentry/browser. While
        // @sentry/node will run in a Node.js environment. @sentry/node will use
        // Node.js-only APIs to catch even more unhandled exceptions.
        //
        // This works well when Next.js is SSRing your page on a server with
        // Node.js, but it is not what we want when your client-side bundle is being
        // Executed by a browser.
        //
        // Luckily, Next.js will call this webpack function twice, once for the
        // Server and once for the client. Read more:
        // https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
        //
        // So ask Webpack to replace @sentry/node imports with @sentry/browser when
        // Building the browser's bundle
        if (!options.isServer) {
            config.resolve.alias["@sentry/node"] = "@sentry/browser";
        }

        return config;
    }
});
