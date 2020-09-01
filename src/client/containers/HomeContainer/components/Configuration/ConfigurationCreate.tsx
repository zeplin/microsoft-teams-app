import React, { FunctionComponent } from "react";
import { Flex, Text } from "@fluentui/react-northstar";

import {
    Project,
    Resource,
    ResourceType,
    Styleguide,
    WebhookEventType,
    Workspace
} from "../../../../lib/requester";
import { WorkspaceDropdown } from "./WorkspaceDropdown";
import { ResourceDropdown } from "./ResourceDropdown";
import { WebhookEvents } from "./WebhookEvents";

interface ConfigurationCreateProps {
    channelName: string;
    areWorkspacesLoading: boolean;
    workspaces: Workspace[];
    isWorkspaceSelected: boolean;
    resourceType: ResourceType;
    areResourcesLoading: boolean;
    projects: Project[];
    styleguides: Styleguide[];
    selectedWebhookEvents: WebhookEventType[];
    onWorkspaceChange: (value: string) => void;
    onResourceChange: (value: Resource | undefined) => void;
    onWebhookEventChange: (value: WebhookEventType) => void;
}

export const ConfigurationCreate: FunctionComponent<ConfigurationCreateProps> = ({
    channelName,
    areWorkspacesLoading,
    workspaces,
    isWorkspaceSelected,
    resourceType,
    areResourcesLoading,
    projects,
    styleguides,
    selectedWebhookEvents,
    onWorkspaceChange,
    onResourceChange,
    onWebhookEventChange
}) => (
    <Flex fill column gap="gap.large">
        <div />
        <Flex fill column gap="gap.small">
            <Text weight="semibold">
                You are connecting <Text weight="bold">#{channelName}</Text> to Zeplin.
            </Text>
            <Text>
                {"Can't find the project/styleguide to connect to? "}
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
                            loading={areWorkspacesLoading}
                            workspaces={workspaces}
                            onChange={onWorkspaceChange}
                        />
                    </div>
                </Flex.Item>
                <Flex.Item grow shrink={0} styles={{ flexBasis: 0 }}>
                    <div>
                        <ResourceDropdown
                            loading={areResourcesLoading}
                            projects={projects}
                            styleguides={styleguides}
                            disabled={!isWorkspaceSelected}
                            onChange={onResourceChange} />
                    </div>
                </Flex.Item>
            </Flex>
        </Flex>
        <Flex fill column gap="gap.medium">
            <Text weight="semibold">
                Select the events you want to get a message for:
            </Text>
            <div>
                <WebhookEvents
                    resourceType={resourceType}
                    selectedWebhookEvents={selectedWebhookEvents}
                    onWebhookEventChange={onWebhookEventChange} />
            </div>
        </Flex>
    </Flex>
);
