import React, { FunctionComponent } from "react";
import { ErrorIcon, Flex, Text } from "@fluentui/react-northstar";

interface ErrorRowParams {
    message?: string;
    onRetryClick: () => void;
}

export const ErrorRow: FunctionComponent<ErrorRowParams> = ({
    message = "Could not proceed due to a connectivity issue, please try again or let us know: support@zeplin.io",
    onRetryClick
}) => (
    <Flex fill gap="gap.smaller">
        <ErrorIcon size="large" />
        <Text error>
            {`${message}. `}
            <Text
                color="brand"
                styles={{
                    ":hover": {
                        cursor: "pointer"
                    }
                }}
                onClick={onRetryClick}>
                Retry
            </Text>
        </Text>
    </Flex>
);
