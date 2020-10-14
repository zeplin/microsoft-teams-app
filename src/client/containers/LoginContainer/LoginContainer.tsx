import React, { FunctionComponent } from "react";

import { useInitialize } from "../../hooks";
import { useLogin } from "./hooks";
import { Login } from "./components";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";
import { url } from "../../lib";

export const LoginContainer: FunctionComponent = () => {
    const { query: { id }, replace } = useRouter();
    const { isInitializeLoading } = useInitialize();
    const [login, { loginError }] = useLogin({
        onSuccess: () => {
            replace(id ? url.configurationUpdate : url.configurationCreate);
        }
    });

    if (isInitializeLoading) {
        return <Loader styles={{ height: "100vh" }} />;
    }
    return <Login onButtonClick={login} error={loginError} />;
};
