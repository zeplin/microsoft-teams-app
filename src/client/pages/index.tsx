import React, { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Loader } from "@fluentui/react-northstar";

import { Providers } from "../Providers";

const HomeContainer = dynamic(
    async () => (await import("../containers")).HomeContainer,
    {
        ssr: false,
        loading: () => <Loader styles={{ height: "100vh" }} />
    }
);

const HomePage: FunctionComponent = () => {
    const routerParam = useRouter();
    const {
        query: {
            theme
        }
    } = routerParam;
    console.log("HomePage routerParam:", JSON.stringify(routerParam, null, 4));

    return (
        <Providers theme={String(theme)}>
            <HomeContainer />
        </Providers>
    );
};

export default HomePage;
