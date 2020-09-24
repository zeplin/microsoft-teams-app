import React, { FunctionComponent } from "react";
import { Button, Flex, Text, ErrorIcon } from "@fluentui/react-northstar";
import { ZEPLIN_WEB_APP_BASE_URL } from "../../../../lib/config";

interface LoginProps {
    error?: string;
    onButtonClick: () => void;
}

const signupURL = new URL(ZEPLIN_WEB_APP_BASE_URL);
signupURL.pathname = `signup`;

export const Login: FunctionComponent<LoginProps> = ({ error, onButtonClick }) => (
    <Flex fill column gap="gap.medium">
        <Flex fill column gap="gap.large">
            <div />
            <Flex fill column gap="gap.medium">
                <Text size="large" weight="semibold">
                    One more step before finishing connection
                </Text>
                <Text>
                    Once proceeding, we will ask you to authorize Microsoft Teams access through a separate window. Once
                    it’s authorized, you can do more advanced settings on the Microsoft Teams channel linked with
                    Zeplin. If you’re not a Zeplin user, you can sign up from <Text
                        as="a"
                        color="brand"
                        href={signupURL.toString()}
                        target="_blank"
                        styles={{
                            "textDecoration": "none",
                            ":hover": {
                                textDecoration: "underline"
                            }
                        }}>
                        here
                    </Text>.
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
        <Text>
        You can learn more about the integration from <Text
                as="a"
                color="brand"
                href="https://zpl.io/msteams-integration-help"
                target="_blank"
                styles={{
                    "textDecoration": "none",
                    ":hover": {
                        textDecoration: "underline"
                    }
                }}>
                here
            </Text>.
        </Text>
    </Flex>
);
