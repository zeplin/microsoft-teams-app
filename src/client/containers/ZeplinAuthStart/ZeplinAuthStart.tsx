import React, { FunctionComponent, useEffect } from "react";
import { Loader } from "@fluentui/react-northstar";

import {
    BASE_URL
} from "../../config";

export const ZeplinAuthStart: FunctionComponent = () => {
    useEffect(() => {
        window.location.assign(`${BASE_URL}/api/auth/authorize`);
    }, []);

    return <Loader />;
};
