import * as Sentry from "@sentry/node";
import React, { ReactElement } from "react";
import { SENTRY_DSN, ENVIRONMENT, VERSION } from "../lib/config";
import { AppProps } from "next/app";

if (SENTRY_DSN) {
    Sentry.init({
        enabled: ENVIRONMENT === "production",
        dsn: SENTRY_DSN,
        release: VERSION,
        environment: ENVIRONMENT
    });
}

export default function App({
    Component,
    pageProps,
    err
}: AppProps<{ err: object }> & { err: object }): ReactElement {
    // Workaround for https://github.com/vercel/next.js/issues/8592
    return <Component {...pageProps} err={err} />;
}
