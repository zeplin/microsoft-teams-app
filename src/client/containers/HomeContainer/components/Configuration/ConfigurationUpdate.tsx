import React, { FunctionComponent } from "react";
import { Flex, Text } from "@fluentui/react-northstar";
import {
    Resource,
    ResourceType,
    WebhookEventType
} from "../../../../requester";
import { WebhookEvents } from "./WebhookEvents";

const resourceTypeTextMap: Record<ResourceType, string> = {
    [ResourceType.PROJECT]: "project",
    [ResourceType.STYLEGUIDE]: "styleguide"
};

const resourceTypeToText = (value: ResourceType): string => resourceTypeTextMap[value];

interface ConfigurationUpdateProps {
    channelName: string;
    resource: Resource;
    selectedWebhookEvents: WebhookEventType[];
    onWebhookEventChange: (value: WebhookEventType) => void;
}

export const ConfigurationUpdate: FunctionComponent<ConfigurationUpdateProps> = ({
    channelName,
    resource,
    selectedWebhookEvents,
    onWebhookEventChange
}) => (
    <Flex fill column gap="gap.large">
        <div />
        <Flex fill column gap="gap.small">
            <Text weight="semibold">
                <Text weight="bold">{resource.name}</Text>
                {` ${resourceTypeToText(resource.type)} is connected to `}
                <Text weight="bold">#{channelName}</Text>
                {" channel."}
            </Text>
        </Flex>
        <Flex fill column gap="gap.medium">
            <Text weight="semibold">
                    Select the events you want to get a message for:
            </Text>
            <div>
                <WebhookEvents
                    resourceType={resource.type}
                    selectedWebhookEvents={selectedWebhookEvents}
                    onWebhookEventChange={onWebhookEventChange} />
            </div>
        </Flex>
    </Flex>
);
