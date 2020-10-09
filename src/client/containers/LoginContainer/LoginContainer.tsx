import React, { FunctionComponent } from "react";

import { useInitialize } from "../../hooks";
import { useLogin } from "./hooks";
import { Login } from "./components";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";

export const LoginContainer: FunctionComponent = () => {
    const { query: { id }, query, replace } = useRouter();
    const { isInitializeLoading } = useInitialize();
    const [login, { loginError }] = useLogin({
        onSuccess: () => {
            const searchParams = new URLSearchParams(query as Record<string, string>).toString();
            const action = id ? "update" : "create";
            replace(`/configuration/${action}?${searchParams}`);
        }
    });

    if (isInitializeLoading) {
        return <Loader styles={{ height: "100vh" }} />;
    }
    return <Login onButtonClick={login} error={loginError} />;
};
