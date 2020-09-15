import React, { FunctionComponent } from "react";
import { Flex, Text } from "@fluentui/react-northstar";

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
import { ErrorRow } from "./ErrorRow";

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
    username?: string;
    onResourceSearch: (value: string) => void;
    onResourceDropdownBlur: () => void;
    onRetryClick: () => void;
    onWorkspaceChange: (value: string) => void;
    onResourceChange: (value: Resource) => void;
    onWebhookEventsChange: (value: WebhookEventType[]) => void;
    onLogoutClick: () => void;
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
    username,
    onResourceSearch,
    onResourceDropdownBlur,
    onRetryClick,
    onWorkspaceChange,
    onResourceChange,
    onWebhookEventsChange,
    onLogoutClick
}) => (
    <Flex fill column gap="gap.large">
        <div />
        <Flex fill column gap="gap.small">
            <Text weight="semibold">
                {"You are connecting "}
                <Text weight="bold">#{channelName}</Text>
                {username
                    ? (
                        <>
                            {" to Zeplin using your "}
                            <Text weight="bold">{username}</Text>
                            {" account."}
                        </>
                    )
                    : " to Zeplin."
                }
            </Text>
            <Text>
                {"If you prefer using another account, you can "}
                <Text
                    color="brand"
                    styles={{
                        ":hover": {
                            cursor: "pointer"
                        }
                    }}
                    onClick={onLogoutClick}>
                    Log out
                </Text>
                {" first. Can't find the project/styleguide to connect to? "}
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
        {isError && <ErrorRow onRetryClick={onRetryClick} />}
        <Flex fill column gap="gap.medium">
            <Text weight="semibold">
                Select the events you want to get a message for:
            </Text>
            <div>
                <WebhookEvents
                    disabled={isError}
                    resourceType={resourceType}
                    selectedWebhookEvents={selectedWebhookEvents}
                    onWebhookEventsChange={onWebhookEventsChange} />
            </div>
        </Flex>
    </Flex>
);
