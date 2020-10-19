import React, { FunctionComponent, ReactElement } from "react";
import { Flex } from "@fluentui/react-northstar";
import { WebhookEventCheckbox } from "./WebhookEventCheckbox";
import { resourceBasedEvents, ResourceType, WebhookEventType } from "../../constants";

const toggleWebhookEvent = (
    webhookEvents: WebhookEventType[],
    webhookEvent: WebhookEventType
): WebhookEventType[] => {
    const index = webhookEvents.indexOf(webhookEvent);
    if (index === -1) {
        return [...webhookEvents, webhookEvent];
    }
    return [...webhookEvents.slice(0, index), ...webhookEvents.slice(index + 1)];
};

const HALF_DIVIDER = 2;

interface WebhookEvent {
    id: WebhookEventType;
    title: string;
    description: string;
}

const webhookEventCheckboxes: WebhookEvent[] = [
    {
        id: WebhookEventType.SCREEN,
        title: "Screens",
        description: "Screens added"
    },
    {
        id: WebhookEventType.SCREEN_VERSION,
        title: "Screen versions",
        description: "Versions added to screen"
    },
    {
        id: WebhookEventType.COMPONENT,
        title: "Components",
        description: "Components added, removed or updated on Styleguide"
    },
    {
        id: WebhookEventType.COLOR,
        title: "Colors",
        description: "Colors added, removed or updated on Styleguide"
    },
    {
        id: WebhookEventType.TEXT_STYLE,
        title: "Text styles",
        description: "Text styles added, removed or updated on Styleguide"
    },
    {
        id: WebhookEventType.SPACING_TOKEN,
        title: "Spacing tokens",
        description: "Spacing tokens added, removed or updated on Styleguide"
    },
    {
        id: WebhookEventType.NOTE,
        title: "Notes",
        description: "Note added"
    },
    {
        id: WebhookEventType.NOTE_COMMENT,
        title: "Replies",
        description: "Replied to note"
    },
    {
        id: WebhookEventType.MEMBER,
        title: "Members",
        description: "Members invited"
    }
];

interface WebhookEventsProps {
    disabled: boolean;
    resourceType: ResourceType;
    selectedWebhookEvents: WebhookEventType[];
    onWebhookEventsChange: (value: WebhookEventType[]) => void;
}

export const WebhookEventCheckboxes: FunctionComponent<WebhookEventsProps> = ({
    disabled,
    resourceType,
    selectedWebhookEvents,
    onWebhookEventsChange
}) => {
    const availableEvents = webhookEventCheckboxes.filter(({ id }) => resourceBasedEvents[resourceType].includes(id));
    const middleIndex = Math.ceil(availableEvents.length / HALF_DIVIDER);

    const renderWebhookEvent = ({ id, title, description }: WebhookEvent): ReactElement => (
        <WebhookEventCheckbox
            disabled={disabled}
            checked={selectedWebhookEvents.includes(id)}
            key={id}
            title={title}
            description={description}
            onChange={(): void => onWebhookEventsChange(toggleWebhookEvent(selectedWebhookEvents, id))} />
    );

    return (
        <Flex fill gap="gap.small">
            <Flex fill column gap="gap.medium">
                {availableEvents.slice(0, middleIndex).map(renderWebhookEvent)}
            </Flex>
            <Flex fill column gap="gap.medium">
                {availableEvents.slice(middleIndex).map(renderWebhookEvent)}
            </Flex>
        </Flex>
    );
};
