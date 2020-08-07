import {
    ResourceType,
    WebhookEvent,
    EventPayload,
    StyleguideContext,
    EventType
} from "../../../messagingTypes";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, AdaptiveCard } from "../utils";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_BASE_URL } from "../../../../../config";
import { URL } from "url";

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
    private getActionText(action: StyleguideColorEventDescriptor["action"]): string {
        if (action === "created") {
            return "added";
        }

        return "updated";
    }

    private getWebappURL(
        events: WebhookEvent<StyleguideColorEventPayload>[]
    ): string {
        const [{
            payload: {
                context: {
                    styleguide: {
                        id: styleguideId
                    }
                }
            }
        }] = events;
        const webappURL = new URL(ZEPLIN_WEB_APP_BASE_URL);
        webappURL.pathname = `styleguide/${styleguideId}/styleguide/colors`;
        events.forEach(event => webappURL.searchParams.append("cid", event.payload.resource.id));
        return webappURL.toString();
    }

    private getMacAppURL(
        events: WebhookEvent<StyleguideColorEventPayload>[]
    ): string {
        const [{
            payload: {
                context: {
                    styleguide: {
                        id: styleguideId
                    }
                }
            }
        }] = events;
        return `${ZEPLIN_MAC_APP_BASE_URL}colors?stid=${styleguideId}&cids=${events.map(event => event.payload.resource.id).join(",")}`;
    }

    getTeamsMessage(
        events: WebhookEvent<StyleguideColorEventPayload>[]
    ): AdaptiveCard {
        const [pivotEvent] = events;
        const {
            payload: {
                action,
                context: {
                    styleguide: { name: styleguideName }
                },
                resource: {
                    data: {
                        name: pivotColorName
                    }
                }
            }
        } = pivotEvent;

        return commonTeamsCard({
            title: styleguideName,
            text: events.length === 1
                ? `**${pivotColorName}** is ${this.getActionText(action)}! 🏃‍♂`
                : `**${events.length} new colors** are ${this.getActionText(action)}! 🏃‍♂`,
            subText: "Make sure your stylesheets are up to date!",
            links: [{
                title: "Open in Web",
                url: this.getWebappURL(events)
            }, {
                title: "Open in App",
                url: this.getMacAppURL(events)
            }]
        });
    }
}

export type StyleguideColorEventPayload = EventPayload<
    StyleguideColorEventDescriptor,
    StyleguideContext,
    StyleguideColorResource
>;
export const styleguideColorNotificationHandler = new StyleguideColorNotificationHandler();