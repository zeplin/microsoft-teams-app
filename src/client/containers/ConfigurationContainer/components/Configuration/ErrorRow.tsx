import React, { FunctionComponent } from "react";
import { ErrorIcon, Flex, Text } from "@fluentui/react-northstar";

interface ErrorRowParams {
    onRetryClick: () => void;
}

export const ErrorRow: FunctionComponent<ErrorRowParams> = ({
    onRetryClick
}) => (
    <Flex fill gap="gap.smaller">
        <ErrorIcon size="large" />
        <Text error>
            {"We cannot proceed the process due to API related connectivity issue. "}
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
