import React, { FunctionComponent, useEffect } from "react";
import { useRouter } from "next/router";
import * as microsoftTeams from "@microsoft/teams-js";
import Axios from "axios";
import { Loader } from "@fluentui/react-northstar";

import { BASE_URL } from "../../config";

export const ZeplinAuthEnd: FunctionComponent = () => {
    const {
        query: {
            code,
            error
        }
    } = useRouter();

    useEffect(() => {
        if (error) {
            microsoftTeams.authentication.notifyFailure(String(error));
        } else {
            microsoftTeams.initialize(async () => {
                try {
                    const { data: { accessToken } } = await Axios.post(`${BASE_URL}/api/auth/token`, { code });
                    microsoftTeams.authentication.notifySuccess(accessToken);
                } catch (e) {
                    if (e.response) {
                        microsoftTeams.authentication.notifyFailure(e.response.data.message);
                    } else {
                        microsoftTeams.authentication.notifyFailure(e?.message ?? String(e));
                    }
                }
            });
        }
    }, []);

    return <Loader />;
};
