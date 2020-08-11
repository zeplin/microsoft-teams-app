import React, { FunctionComponent } from "react";
import { Button, Flex, Text } from "@fluentui/react-northstar";
import * as microsoftTeams from "@microsoft/teams-js";
import { BASE_URL } from "../../../config";

interface LoginProps {
    onTokenReceive: (token: string) => void;
}

export const Login: FunctionComponent<LoginProps> = ({ onTokenReceive }) => (
    <Flex fill column gap="gap.large">
        <div />
        <Flex fill column gap="gap.medium">
            <Text size="large" weight="semibold">
                One more step before finishing connection
            </Text>
            <Text>
                Once proceeding, we will ask you to authorize Microsoft Teams access through a separate window. Once
                it’s authorized, you can do more advanced settings on the Teams channel linked with Zeplin.
            </Text>
        </Flex>
        <div>
            <Button
                content="Log in Zeplin"
                onClick={(): void => {
                    microsoftTeams.authentication.authenticate({
                        height: 476,
                        successCallback: onTokenReceive,
                        url: `${BASE_URL}/api/auth/authorize`
                    });
                }} />
        </div>
    </Flex>
);
