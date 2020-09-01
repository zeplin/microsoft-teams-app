import React, { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Loader } from "@fluentui/react-northstar";

import { Providers } from "../Providers";

const ConfigurationContainer = dynamic(
    async () => (await import("../containers")).ConfigurationContainer,
    {
        ssr: false,
        loading: () => <Loader styles={{ height: "100vh" }} />
    }
);

const ConfigurationPage: FunctionComponent = () => {
    const {
        query: {
            theme
        }
    } = useRouter();

    return (
        <Providers theme={String(theme)}>
            <ConfigurationContainer />
        </Providers>
    );
};

export default ConfigurationPage;
