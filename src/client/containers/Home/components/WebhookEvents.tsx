import React, { FunctionComponent } from "react";
import { ResourceType, WebhookEvent } from "./types";
import { Flex } from "@fluentui/react-northstar";
import { ConfigurationCheckbox } from "./ConfigurationCheckbox";

const HALF_DIVIDER = 2;

const webhookEvents: WebhookEvent[] = [
    {
        title: "Screens",
        description: "Screens added",
        resourceTypes: [ResourceType.PROJECT]
    },
    {
        title: "Screen versions",
        description: "Versions added to screen",
        resourceTypes: [ResourceType.PROJECT]
    },
    {
        title: "Components",
        description: "Components added, removed or updated on Styleguide",
        resourceTypes: [ResourceType.PROJECT, ResourceType.STYLEGUIDE]
    },
    {
        title: "Colors",
        description: "Colors added, removed or updated on Styleguide",
        resourceTypes: [ResourceType.PROJECT, ResourceType.STYLEGUIDE]
    },
    {
        title: "Text styles",
        description: "Text styles added, removed or updated on Styleguide",
        resourceTypes: [ResourceType.PROJECT, ResourceType.STYLEGUIDE]
    },
    {
        title: "Spacing tokens",
        description: "Spacing tokens added, removed or updated on Styleguide",
        resourceTypes: [ResourceType.PROJECT, ResourceType.STYLEGUIDE]
    },
    {
        title: "Notes",
        description: "Note added",
        resourceTypes: [ResourceType.PROJECT]
    },
    {
        title: "Replies",
        description: "Replied to note",
        resourceTypes: [ResourceType.PROJECT]
    },
    {
        title: "Members",
        description: "Members invited",
        resourceTypes: [ResourceType.PROJECT, ResourceType.STYLEGUIDE]
    }
];

interface WebhookEventsProps {
    resourceType: ResourceType;
}

export const WebhookEvents: FunctionComponent<WebhookEventsProps> = ({
    resourceType
}) => {
    const availableEvents = webhookEvents.filter(({ resourceTypes }) => resourceTypes.includes(resourceType));
    const middleIndex = Math.ceil(availableEvents.length / HALF_DIVIDER);
    return (
        <Flex fill gap="gap.small">
            <Flex fill column gap="gap.smaller">
                {
                    availableEvents.slice(0, middleIndex).map(({ title, description }) => (
                        <ConfigurationCheckbox key={title} title={title} description={description} />
                    ))
                }
            </Flex>
            <Flex fill column gap="gap.smaller">
                {
                    availableEvents.slice(middleIndex).map(({ title, description }) => (
                        <ConfigurationCheckbox key={title} title={title} description={description} />
                    ))
                }
            </Flex>
        </Flex>
    );
};
