import React, { ReactElement } from "react";
import Error, { ErrorProps } from "next/error";

export default function NotFoundPage({ statusCode }: ErrorProps): ReactElement {
    return <Error statusCode={statusCode}/>;
}