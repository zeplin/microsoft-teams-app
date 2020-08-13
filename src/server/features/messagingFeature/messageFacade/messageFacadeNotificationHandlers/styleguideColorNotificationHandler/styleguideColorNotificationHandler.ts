import {
    ResourceType,
    WebhookEvent,
    EventPayload,
    StyleguideContext,
    EventType
} from "../../../messagingTypes";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, AdaptiveCard } from "../teamsCardTemplates";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../../config";
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
    private getText(events: WebhookEvent<StyleguideColorEventPayload>[]): string {
        const [{
            payload: {
                action,
                context: {
                    styleguide: {
                        name: styleguideName
                    }
                },
                resource: {
                    data: {
                        name: pivotColorName
                    }
                }
            }
        }] = events;
        const actionText = action === "created" ? "added" : "updated";
        return events.length === 1
            ? `**${pivotColorName}** is ${actionText} in _${styleguideName}_! 🏃‍♂`
            : `**${events.length} new colors** are ${actionText} in _${styleguideName}_! 🏃‍♂`;
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
        return `${ZEPLIN_MAC_APP_URL_SCHEME}colors?stid=${styleguideId}&cids=${events.map(event => event.payload.resource.id).join(",")}`;
    }

    shouldHandleEvent(event: WebhookEvent): boolean {
        return event.payload.action !== "deleted";
    }

    getTeamsMessage(
        events: WebhookEvent<StyleguideColorEventPayload>[]
    ): AdaptiveCard {
        return commonTeamsCard({
            text: this.getText(events),
            sectionText: "Make sure your stylesheets are up to date!",
            links: [{
                title: "Open in App",
                url: this.getMacAppURL(events)
            }, {
                title: "Open in Web",
                url: this.getWebappURL(events)
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