import NextErrorComponent, { ErrorProps } from "next/error";
import React, { ReactElement } from "react";
import * as Sentry from "@sentry/node";
import { NextPageContext } from "next";
import { NOT_FOUND } from "http-status-codes";

type CustomErrorProps = ErrorProps & {
    hasGetInitialPropsRun?: boolean;
};

const ErrorComponentWithSentry = ({
    statusCode,
    hasGetInitialPropsRun,
    err
}: CustomErrorProps & NextPageContext): ReactElement => {
    if (!hasGetInitialPropsRun && err) {
        // `getInitialProps` is not called in case of
        // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
        // `err` via _app.js so it can be captured
        Sentry.captureException(err);
    }

    return <NextErrorComponent statusCode={statusCode} />;
};

ErrorComponentWithSentry.getInitialProps = async (pageContext: NextPageContext): Promise<CustomErrorProps> => {
    const { res, err, asPath } = pageContext;
    const errorInitialProps: CustomErrorProps = await NextErrorComponent.getInitialProps(pageContext);

    // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
    // `getInitialProps` has run
    errorInitialProps.hasGetInitialPropsRun = true;

    // Running on the server, the response object (`res`) is available.
    //
    // Next.js will pass an err on the server if a page's data fetching methods
    // Threw or returned a Promise that rejected
    //
    // Running on the client (browser), Next.js will provide an err if:
    //
    //  - a page's `getInitialProps` threw or returned a Promise that rejected
    //  - an exception was thrown somewhere in the React lifecycle (render,
    //    `componentDidMount`, etc) that was caught by Next.js's React Error
    //    Boundary. Read more about what types of exceptions are caught by Error
    //    Boundaries: https://reactjs.org/docs/error-boundaries.html

    if (res?.statusCode === NOT_FOUND) {
        // Opinionated: do not record an exception in Sentry for 404
        return { statusCode: NOT_FOUND };
    }
    if (err) {
        Sentry.captureException(err);
        await Sentry.flush();
        return errorInitialProps;
    }

    // If this point is reached, getInitialProps was called without any
    // Information about what the error might be. This is unexpected and may
    // Indicate a bug introduced in Next.js, so record it in Sentry
    Sentry.captureException(
        new Error(`_error.tsx getInitialProps missing data at path: ${asPath}`)
    );
    await Sentry.flush(0);

    return errorInitialProps;
};

export default ErrorComponentWithSentry;
