import React, { FunctionComponent, useEffect } from "react";
import { useRouter } from "next/router";
import * as microsoftTeams from "@microsoft/teams-js";
import { Loader } from "@fluentui/react-northstar";

import { getAccessToken } from "../../requester";

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
                const accessToken = await getAccessToken(String(code));
                microsoftTeams.authentication.notifySuccess(accessToken);
            } catch (e) {
                if (e.response) {
                    microsoftTeams.authentication.notifyFailure(e.response.data.message);
                } else {
                    microsoftTeams.authentication.notifyFailure(e?.message ?? String(e));
                }
            }
        });
    }, []);

    return <Loader />;
};
