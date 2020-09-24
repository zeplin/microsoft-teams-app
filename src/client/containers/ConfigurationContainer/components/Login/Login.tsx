import React, { FunctionComponent } from "react";
import { Button, Flex, Text, ErrorIcon } from "@fluentui/react-northstar";

interface LoginProps {
    error?: string;
    onButtonClick: () => void;
}

export const Login: FunctionComponent<LoginProps> = ({ error, onButtonClick }) => (
    <Flex fill column gap="gap.large">
        <div />
        <Flex fill column gap="gap.medium">
            <Text size="large" weight="semibold">
                One more step before finishing connection
            </Text>
            <Text>
                Once proceeding, we will ask you to authorize Microsoft Teams access through a separate window. Once
                it’s authorized, you can do more advanced settings on the Microsoft Teams channel linked with Zeplin.
            </Text>
            {error && (
                <Flex fill gap="gap.smaller">
                    <ErrorIcon size="large" />
                    <Text error>
                        {error}
                    </Text>
                </Flex>
            )}
        </Flex>
        <div>
            <Button
                primary
                content="Log in Zeplin"
                onClick={(): void => onButtonClick()} />
        </div>
    </Flex>
);
