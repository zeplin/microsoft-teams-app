import React, { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Loader } from "@fluentui/react-northstar";

import { Providers } from "../../../Providers";

const ZeplinAuthEnd = dynamic(
    async () => (await import("../../../containers")).ZeplinAuthEndContainer,
    {
        ssr: false,
        loading: () => <Loader />
    }
);

const ZeplinAuthEndPage: FunctionComponent = () => {
    const {
        query: {
            theme
        }
    } = useRouter();

    return (
        <Providers theme={String(theme)}>
            <ZeplinAuthEnd />
        </Providers>
    );
};

export default ZeplinAuthEndPage;
