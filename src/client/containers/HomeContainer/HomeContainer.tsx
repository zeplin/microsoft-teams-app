import React, { FunctionComponent, useEffect } from "react";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";

import { storage } from "../../lib";

export const HomeContainer: FunctionComponent = () => {
    const { query: { channel, id }, query, replace } = useRouter();

    const getUrl = (): string => {
        const searchParams = new URLSearchParams(query as Record<string, string>).toString();
        if (!storage.getAccessToken()) {
            return `/login?${searchParams}`;
        }
        if (id) {
            return `/configuration/update?${searchParams}`;
        }
        return `/configuration/create?${searchParams}`;
    };

    useEffect(() => {
        if (channel && channel !== "{channelName}") {
            replace(getUrl());
        }
    }, []);

    return <Loader styles={{ height: "100vh" }} />;
};
