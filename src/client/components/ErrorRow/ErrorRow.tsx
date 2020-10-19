import React, { FunctionComponent } from "react";
import { ErrorIcon, Flex, Text } from "@fluentui/react-northstar";

interface ErrorRowParams {
    message: string;
    hideRetry?: boolean;
    onRetryClick: () => void;
}

export const ErrorRow: FunctionComponent<ErrorRowParams> = ({
    message,
    hideRetry,
    onRetryClick
}) => (
    <Flex fill gap="gap.smaller">
        <ErrorIcon size="large" />
        <Text error>
            {message}
            {!hideRetry && (<>
                {" "}
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
            </>)}
        </Text>
    </Flex>
);
