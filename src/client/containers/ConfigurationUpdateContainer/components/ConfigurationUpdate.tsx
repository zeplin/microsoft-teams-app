import React, { FunctionComponent } from "react";
import { Flex, Text } from "@fluentui/react-northstar";
import {
    Resource,
    ResourceType,
    WebhookEventType
} from "../../../constants";
import { ErrorRow, WebhookEventCheckboxes } from "../../../components";

const resourceTypeTextMap: Record<ResourceType, string> = {
    [ResourceType.PROJECT]: "project",
    [ResourceType.STYLEGUIDE]: "styleguide"
};

const resourceTypeToText = (value: ResourceType): string => resourceTypeTextMap[value];

interface ConfigurationUpdateProps {
    channelName: string;
    resource: Resource;
    selectedWebhookEvents: WebhookEventType[];
    disabled: boolean;
    errorMessage?: string;
    hideRetry: boolean;
    username?: string;
    onRetryClick: () => void;
    onWebhookEventsChange: (value: WebhookEventType[]) => void;
    onLogoutClick: () => void;
}

export const ConfigurationUpdate: FunctionComponent<ConfigurationUpdateProps> = ({
    channelName,
    resource,
    selectedWebhookEvents,
    disabled,
    errorMessage,
    hideRetry,
    username,
    onRetryClick,
    onWebhookEventsChange,
    onLogoutClick
}) => (
    <Flex fill column gap="gap.large">
        <div />
        <Flex fill column gap="gap.small">
            <Text weight="semibold">
                <Text weight="bold">{resource.name}</Text>
                {` ${resourceTypeToText(resource.type)} is connected to `}
                <Text weight="bold">{channelName}</Text>
                {" channel."}
            </Text>
            {username &&
                <Text>
                    You’re logged in to your Zelin account <Text weight="bold">{username}</Text>.
                    If you prefer using another account, you can <Text
                        color="brand"
                        styles={{
                            ":hover": {
                                cursor: "pointer"
                            }
                        }}
                        onClick={onLogoutClick}>
                        Log out
                    </Text> first.
                </Text>
            }
        </Flex>
        {errorMessage && <ErrorRow onRetryClick={onRetryClick} message={errorMessage} hideRetry={hideRetry} />}
        <Flex fill column gap="gap.medium">
            <Text weight="semibold">
                    Select the events you want to get a message for:
            </Text>
            <div>
                <WebhookEventCheckboxes
                    disabled={disabled}
                    resourceType={resource.type}
                    selectedWebhookEvents={selectedWebhookEvents}
                    onWebhookEventsChange={onWebhookEventsChange} />
            </div>
        </Flex>
    </Flex>
);
