import {
    ResourceType,
    WebhookEvent,
    EventPayload,
    StyleguideContext,
    EventType
} from "../../../messageTypes";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";

type StyleguideColorEventDescriptor = {
    type: EventType.STYLEGUIDE_COLOR;
    action: "created" | "updated";
};

type StyleguideColorDeletedEventDescriptor = {
    type: EventType.STYLEGUIDE_COLOR;
    action: "deleted";
}

type StyleguideColorResource = {
    id: string;
    type: ResourceType.COLOR;
    data: {
        id: string;
        created: number;
        name: string;
        r: number;
        g: number;
        b: number;
        a: number;
    };
};

function isDeletedEvents(
    events:
        | WebhookEvent<StyleguideColorEventPayload>[]
        | WebhookEvent<StyleguideColorDeletedEventPayload>[]
): events is WebhookEvent<StyleguideColorDeletedEventPayload>[] {
    return events[0].payload.action === "deleted";
}

class StyleguideColorNotificationHandler extends NotificationHandler {
    delay = SHORT_DELAY;
    private getDeleteMessage(
        events: WebhookEvent<StyleguideColorDeletedEventPayload>[]
    ): string {
        if (events.length === 1) {
            return `A color is deleted from styleguide ${events[0].payload.context.styleguide.id}`;
        }

        return events.map(event => event.deliveryId).join(" ");
    }

    private getCreateMessage(
        events: WebhookEvent<StyleguideColorEventPayload>[]
    ): string {
        if (events.length === 1) {
            return `Color ${events[0].payload.resource.id} is added to styleguide ${events[0].payload.context.styleguide.id}`;
        }

        return events.map(event => event.deliveryId).join(" ");
    }

    private getUpdateMessage(
        events: WebhookEvent<StyleguideColorEventPayload>[]
    ): string {
        if (events.length === 1) {
            return `Color ${events[0].payload.resource.id} is updated in styleguide ${events[0].payload.context.styleguide.id}`;
        }

        return events.map(event => event.deliveryId).join(" ");
    }

    getTeamsMessage(
        events: WebhookEvent<StyleguideColorEventPayload>[] | WebhookEvent<StyleguideColorDeletedEventPayload>[]
    ): string {
        if (isDeletedEvents(events)) {
            return this.getDeleteMessage(events);
        }

        if (events[0].payload.action === "created") {
            return this.getCreateMessage(events);
        }

        return this.getUpdateMessage(events);
    }
}

export type StyleguideColorDeletedEventPayload = EventPayload<
    StyleguideColorDeletedEventDescriptor,
    StyleguideContext,
    { id: string; type: ResourceType.COLOR }
>;
export type StyleguideColorEventPayload = EventPayload<
    StyleguideColorEventDescriptor,
    StyleguideContext,
    StyleguideColorResource
>;
export const styleguideColorNotificationHandler = new StyleguideColorNotificationHandler();