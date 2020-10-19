import React, { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Loader } from "@fluentui/react-northstar";

import { Providers } from "../../Providers";

const ConfigurationCreateContainer = dynamic(
    async () => (await import("../../containers")).ConfigurationCreateContainer,
    {
        ssr: false,
        loading: () => <Loader styles={{ height: "100vh" }} />
    }
);

const ConfigurationCreatePage: FunctionComponent = () => {
    const {
        query: {
            theme
        }
    } = useRouter();

    return (
        <Providers theme={String(theme)}>
            <ConfigurationCreateContainer />
        </Providers>
    );
};

export default ConfigurationCreatePage;
