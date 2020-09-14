import React, { FunctionComponent } from "react";
import { ErrorIcon, Flex, Text } from "@fluentui/react-northstar";

interface ErrorRowParams {
    message?: string;
    onRetryClick: () => void;
}

export const ErrorRow: FunctionComponent<ErrorRowParams> = ({
    message = "We cannot proceed the process due to API related connectivity issue",
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
