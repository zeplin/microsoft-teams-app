import React, { FunctionComponent, useEffect } from "react";
import { useRouter } from "next/router";
import * as microsoftTeams from "@microsoft/teams-js";
import { Loader } from "@fluentui/react-northstar";

import { fetchAuthToken } from "../../lib/requester";
import { storage } from "../../lib/storage";

export const ZeplinAuthEndContainer: FunctionComponent = () => {
    const {
        query: {
            code,
            error
        }
    } = useRouter();

    useEffect(() => {
        microsoftTeams.initialize(async () => {
            if (error) {
                microsoftTeams.authentication.notifyFailure(String(error));
                return;
            }

            try {
                const { accessToken, refreshToken } = await fetchAuthToken(String(code));
                storage.setAccessToken(accessToken);
                storage.setRefreshToken(refreshToken);
                microsoftTeams.authentication.notifySuccess();
            } catch (e) {
                if (e.response) {
                    microsoftTeams.authentication.notifyFailure(e.response.data.message);
                } else {
                    microsoftTeams.authentication.notifyFailure(e?.message ?? String(e));
                }
            }
        });
    }, []);

    return <Loader styles={{ height: "100vh" }} />;
};
