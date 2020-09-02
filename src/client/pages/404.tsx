import React, { ReactElement } from "react";
import Error from "next/error";

export default function NotFoundPage(): ReactElement {
    return <Error statusCode={404}/>;
}