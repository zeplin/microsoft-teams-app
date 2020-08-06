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

class StyleguideColorNotificationHandler extends NotificationHandler {
    delay = SHORT_DELAY;
    getTeamsMessage(events: WebhookEvent<StyleguideColorEventPayload>[]): string {
        if (events.length === 1) {
            const [event] = events;
            return `Color named ${event.payload.resource.data.name} updated for styleguide ${event.payload.context.styleguide.id}`;
        }

        return events.map(event => event.deliveryId).join(" ");
    }
}

export type StyleguideColorEventPayload = EventPayload<
    StyleguideColorEventDescriptor,
    StyleguideContext,
    StyleguideColorResource
>;
export const styleguideColorNotificationHandler = new StyleguideColorNotificationHandler();