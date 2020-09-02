import React, { FunctionComponent } from "react";
import { useRouter } from "next/router";

import { ConfigurationCreateContainer } from "./ConfigurationCreateContainer";
import { ConfigurationUpdateContainer } from "./ConfigurationUpdateContainer";

export const ConfigurationContainer: FunctionComponent = () => {
    const { query: { channel, id } } = useRouter();

    // Workaround: Microsoft Teams initialize two iframes
    // One with query parameters and the other without query parameters
    // TODO: Find a robust solution to disable second iframe
    if (!channel) {
        return null;
    }

    if (id) {
        return <ConfigurationUpdateContainer />;
    }

    return <ConfigurationCreateContainer />;
};
