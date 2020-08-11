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
            <Text size="large" content="One more step before finishing connection" weight="semibold" />
            <Text>
                Once proceeding, we will ask you to authorize Microsoft Teams access through a separate window. Once
                it’s authorized, you can do more advanced settings on the Teams channel linked with Zeplin.
            </Text>
        </Flex>
        <div>
            <Button
                onClick={(): void => {
                    microsoftTeams.authentication.authenticate({
                        successCallback: onTokenReceive,
                        url: `${BASE_URL}/zeplin/auth/start`
                    });
                }}>
                Log in Zeplin
            </Button>
        </div>
    </Flex>
);
