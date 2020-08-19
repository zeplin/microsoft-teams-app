import React, { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Loader } from "@fluentui/react-northstar";

import { Providers } from "../Providers";

const Home = dynamic(
    async () => (await import("../containers")).HomeContainer,
    {
        ssr: false,
        loading: () => <Loader />
    }
);

const HomePage: FunctionComponent = () => {
    const {
        query: {
            theme
        }
    } = useRouter();

    return (
        <Providers theme={String(theme)}>
            <Home />
        </Providers>
    );
};

export default HomePage;
