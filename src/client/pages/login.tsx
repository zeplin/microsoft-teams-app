import React, { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Loader } from "@fluentui/react-northstar";

import { Providers } from "../Providers";

const LoginContainer = dynamic(
    async () => (await import("../containers")).LoginContainer,
    {
        ssr: false,
        loading: () => <Loader styles={{ height: "100vh" }} />
    }
);

const LoginPage: FunctionComponent = () => {
    const {
        query: {
            theme
        }
    } = useRouter();

    return (
        <Providers theme={String(theme)}>
            <LoginContainer />
        </Providers>
    );
};

export default LoginPage;
