import * as Sentry from "@sentry/node";
import React, { ReactElement } from "react";
import {
    SENTRY_DSN,
    VERSION,
    IS_SENTRY_ENABLED,
    ENVIRONMENT
} from "../lib/config";
import { AppProps } from "next/app";

if (SENTRY_DSN) {
    Sentry.init({
        enabled: IS_SENTRY_ENABLED,
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
