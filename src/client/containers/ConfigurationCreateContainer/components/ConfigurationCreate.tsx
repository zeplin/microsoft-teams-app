import React, { FunctionComponent } from "react";
import { Flex, Text } from "@fluentui/react-northstar";

import {
    Project,
    Resource,
    ResourceType,
    Styleguide,
    WebhookEventType,
    Workspace
} from "../../../constants";
import { WorkspaceDropdown } from "./WorkspaceDropdown";
import { ResourceDropdown } from "./ResourceDropdown";
import { ErrorRow, WebhookEventCheckboxes } from "../../../components";

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
    disabled: boolean;
    hideRetry: boolean;
    errorMessage?: string;
    resourceSearch: string;
    username?: string;
    onResourceSearch: (value: string) => void;
    onResourceDropdownFocus: () => void;
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
    disabled,
    hideRetry,
    errorMessage,
    resourceSearch,
    username,
    onResourceSearch,
    onResourceDropdownFocus,
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
                <Text weight="bold">{channelName}</Text>
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
                    href="https://zpl.io/msteams-integration-help"
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
                            onFocus={onResourceDropdownFocus}
                            onBlur={onResourceDropdownBlur}
                            onSearchChange={onResourceSearch}
                            onChange={onResourceChange} />
                    </div>
                </Flex.Item>
            </Flex>
        </Flex>
        {errorMessage && (<ErrorRow onRetryClick={onRetryClick} hideRetry={hideRetry} message={errorMessage} />)}
        <Flex fill column gap="gap.medium">
            <Text weight="semibold">
                Select the events you want to get a message for:
            </Text>
            <div>
                <WebhookEventCheckboxes
                    disabled={disabled}
                    resourceType={resourceType}
                    selectedWebhookEvents={selectedWebhookEvents}
                    onWebhookEventsChange={onWebhookEventsChange} />
            </div>
        </Flex>
    </Flex>
);
