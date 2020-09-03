import React, { FunctionComponent } from "react";
import { ErrorIcon, Flex, Text } from "@fluentui/react-northstar";

import {
    Project,
    Resource,
    ResourceType,
    Styleguide,
    WebhookEventType,
    Workspace
} from "../../../../constants";
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
    isError: boolean;
    resourceSearch: string;
    onResourceSearch: (value: string) => void;
    onResourceDropdownBlur: () => void;
    onRetryClick: () => void;
    onWorkspaceChange: (value: string) => void;
    onResourceChange: (value: Resource | undefined) => void;
    onWebhookEventsChange: (value: WebhookEventType[]) => void;
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
    isError,
    resourceSearch,
    onResourceSearch,
    onResourceDropdownBlur,
    onRetryClick,
    onWorkspaceChange,
    onResourceChange,
    onWebhookEventsChange
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
                            search={resourceSearch}
                            onBlur={onResourceDropdownBlur}
                            onSearchChange={onResourceSearch}
                            onChange={onResourceChange} />
                    </div>
                </Flex.Item>
            </Flex>
        </Flex>
        {isError && (
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
        )}
        <Flex fill column gap="gap.medium">
            <Text weight="semibold">
                Select the events you want to get a message for:
            </Text>
            <div>
                <WebhookEvents
                    resourceType={resourceType}
                    selectedWebhookEvents={selectedWebhookEvents}
                    onWebhookEventsChange={onWebhookEventsChange} />
            </div>
        </Flex>
    </Flex>
);
