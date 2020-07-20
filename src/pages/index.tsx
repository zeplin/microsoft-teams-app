import React, { FunctionComponent } from "react";
import dynamic from "next/dynamic";

const Home = dynamic(
    () => import("containers/Home"),
    { ssr: false }
);

const HomePage: FunctionComponent = () => <Home />;

export default HomePage;
