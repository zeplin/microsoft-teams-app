import React, { FunctionComponent, useState } from "react";
import { Flex, Text } from "@fluentui/react-northstar";
import Axios from "axios";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

import { BASE_URL } from "../../../config";
import { WorkspaceDropdown } from "./WorkspaceDropdown";
import { Resource, ResourceType, Workspace } from "./types";
import { ResourceDropdown } from "./ResourceDropdown";
import { WebhookEvents } from "./WebhookEvents";

interface ConfigurationProps {
    accessToken: string;
}

export const Configuration: FunctionComponent<ConfigurationProps> = ({
    accessToken
}) => {
    const {
        query: {
            channel
        }
    } = useRouter();

    const { isLoading: isOrganizationsLoading, data: organizations } = useQuery(
        "organizations",
        async () => {
            const { data: result } = await Axios.get(
                `${BASE_URL}/api/organizations`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            return result;
        },
        {
            initialData: []
        }
    );

    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>();
    const [selectedResource, setSelectedResource] = useState<Resource | undefined>();

    return (
        <Flex fill column gap="gap.large">
            <div />
            <Flex fill column gap="gap.small">
                <Text weight="semibold">
                    You are connecting <Text weight="bold">#{channel}</Text> to Zeplin.
                </Text>
                <Text>
                    Can{"'"}t find the project/styleguide to connect to?
                    {" "}
                    <Text
                        as="a"
                        color="brand"
                        href="https://zpl.io/msteams-app-docs"
                        target="_blank"
                        styles={{
                            "textDecoration": "none",
                            ":hover": {
                                textDecoration: "underline"
                            }
                        }}>
                        Learn more about permissions.
                    </Text>
                </Text>
                <Flex fill gap="gap.small">
                    <Flex.Item grow shrink={0} styles={{ flexBasis: 0 }}>
                        <div>
                            <WorkspaceDropdown
                                loading={isOrganizationsLoading}
                                organizations={organizations}
                                onChange={(workspace): void => {
                                    setSelectedWorkspace(workspace);
                                    setSelectedResource(undefined);
                                }} />
                        </div>
                    </Flex.Item>
                    <Flex.Item grow shrink={0} styles={{ flexBasis: 0 }}>
                        <div>
                            <ResourceDropdown
                                disabled={!selectedWorkspace}
                                onChange={(resource): void => setSelectedResource(resource)} />
                        </div>
                    </Flex.Item>
                </Flex>
            </Flex>
            <Flex fill column gap="gap.medium">
                <Text weight="semibold">
                    Select the events you want to get a message for:
                </Text>
                <WebhookEvents resourceType={selectedResource?.type ?? ResourceType.PROJECT} />
            </Flex>
        </Flex>
    );
};
