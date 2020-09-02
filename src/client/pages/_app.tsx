import * as Sentry from "@sentry/node";
import React, { ReactElement } from "react";
import { SENTRY_DSN } from "../lib/config";
import { AppProps } from "next/app";

if (SENTRY_DSN) {
    Sentry.init({
        dsn: SENTRY_DSN
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
