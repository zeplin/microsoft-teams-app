import React, { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Loader } from "@fluentui/react-northstar";

import { Providers } from "../../Providers";

const ConfigurationUpdateContainer = dynamic(
    async () => (await import("../../containers")).ConfigurationUpdateContainer,
    {
        ssr: false,
        loading: () => <Loader styles={{ height: "100vh" }} />
    }
);

const ConfigurationUpdatePage: FunctionComponent = () => {
    const {
        query: {
            theme
        }
    } = useRouter();

    return (
        <Providers theme={String(theme)}>
            <ConfigurationUpdateContainer />
        </Providers>
    );
};

export default ConfigurationUpdatePage;
