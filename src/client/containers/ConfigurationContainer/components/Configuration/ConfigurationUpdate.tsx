import React, { FunctionComponent } from "react";
import { Flex, Text } from "@fluentui/react-northstar";
import {
    Resource,
    ResourceType,
    WebhookEventType
} from "../../../../constants";
import { WebhookEvents } from "./WebhookEvents";
import { ErrorRow } from "./ErrorRow";

const resourceTypeTextMap: Record<ResourceType, string> = {
    [ResourceType.PROJECT]: "project",
    [ResourceType.STYLEGUIDE]: "styleguide"
};

const resourceTypeToText = (value: ResourceType): string => resourceTypeTextMap[value];

interface ConfigurationUpdateProps {
    channelName: string;
    resource: Resource;
    selectedWebhookEvents: WebhookEventType[];
    isError: boolean;
    onRetryClick: () => void;
    onWebhookEventsChange: (value: WebhookEventType[]) => void;
}

export const ConfigurationUpdate: FunctionComponent<ConfigurationUpdateProps> = ({
    channelName,
    resource,
    selectedWebhookEvents,
    isError,
    onRetryClick,
    onWebhookEventsChange
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
        {isError && <ErrorRow onRetryClick={onRetryClick} />}
        <Flex fill column gap="gap.medium">
            <Text weight="semibold">
                    Select the events you want to get a message for:
            </Text>
            <div>
                <WebhookEvents
                    disabled={isError}
                    resourceType={resource.type}
                    selectedWebhookEvents={selectedWebhookEvents}
                    onWebhookEventsChange={onWebhookEventsChange} />
            </div>
        </Flex>
    </Flex>
);
