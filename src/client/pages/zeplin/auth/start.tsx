import React, { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Loader } from "@fluentui/react-northstar";

import { Providers } from "../../../components";

const ZeplinAuthStart = dynamic(
    async () => (await import("../../../containers")).ZeplinAuthStart,
    {
        ssr: false,
        loading: () => <Loader />
    }
);

const ZeplinAuthStartPage: FunctionComponent = () => {
    const {
        query: {
            theme
        }
    } = useRouter();

    return (
        <Providers theme={String(theme)}>
            <ZeplinAuthStart />
        </Providers>
    );
};

export default ZeplinAuthStartPage;
