import React, { FunctionComponent } from "react";
import dynamic from "next/dynamic";

const ZeplinAppRedirect = dynamic(
    async () => (await import("../../containers")).ZeplinAppRedirectContainer,
    {
        ssr: false,
        loading: () => <></>
    }
);

const ZeplinAuthEndPage: FunctionComponent = () => <ZeplinAppRedirect/>;

export default ZeplinAuthEndPage;
