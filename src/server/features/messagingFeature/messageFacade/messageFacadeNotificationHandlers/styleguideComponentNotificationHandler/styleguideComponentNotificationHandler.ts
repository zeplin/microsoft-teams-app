import { NotificationHandler } from "../NotificationHandler";
import { AdaptiveCard, commonTeamsCard } from "../teamsCardTemplates";
import {
    WebhookEvent,
    CommonEventPayload,
    EventType,
    EventPayload,
    StyleguideContext
} from "../../../messagingTypes";
import { MEDIUM_DELAY } from "../constants";
import { ComponentResource } from "../resources/componentResource";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../../config";

const IMAGE_LIMIT = 5;

type StyleguideComponentEventDescriptor = {
    type: EventType.STYLEGUIDE_COMPONENT;
    action: "created" | "version_created";
};

class StyleguideComponentNotificationHandler extends NotificationHandler {
    delay = MEDIUM_DELAY;

    private getText(events: WebhookEvent<StyleguideComponentEventPayload>[]): string {
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
                        name: componentName
                    }
                }
            }
        }] = events;
        const actionText = action === "created" ? "added" : "updated";
        return events.length === 1
            ? `**${componentName}** is ${actionText} in _${styleguideName}_! 🏃‍♂️`
            : `**${events.length}${action === "created" ? " new" : ""} components** are ${actionText} in _${styleguideName}_! 🏃‍♂️`;
    }

    private getImages(events: WebhookEvent<StyleguideComponentEventPayload>[]): string[] {
        // Take last 5 screen images
        return events
            .sort((e1, e2) => e2.payload.timestamp - e1.payload.timestamp)
            .map(event => event.payload.resource.data.image.original_url)
            .filter(Boolean)
            .slice(0, IMAGE_LIMIT);
    }

    private getWebappURL(events: WebhookEvent<StyleguideComponentEventPayload>[]): string {
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
        webappURL.pathname = `styleguide/${styleguideId}/styleguide/components`;
        events.forEach(event => webappURL.searchParams.append("coid", event.payload.resource.id));
        return webappURL.toString();
    }

    private getMacAppURL(events: WebhookEvent<StyleguideComponentEventPayload>[]): string {
        const [{
            payload: {
                context: {
                    styleguide: {
                        id: styleguideId
                    }
                }
            }
        }] = events;
        return `${ZEPLIN_MAC_APP_URL_SCHEME}components?stid=${styleguideId}&coids=${events.map(event => event.payload.resource.id).join(",")}`;
    }

    getTeamsMessage(events: WebhookEvent<StyleguideComponentEventPayload>[]): AdaptiveCard {
        return commonTeamsCard({
            text: this.getText(events),
            // TODO: Delete after screen PR
            sectionText: "",
            images: this.getImages(events),
            links: [{
                title: "Open in App",
                url: this.getMacAppURL(events)
            }, {
                title: "Open in Web",
                url: this.getWebappURL(events)
            }]
        });
    }

    shouldHandleEvent(event: WebhookEvent<CommonEventPayload>): boolean {
        return event.payload.action === "created" || event.payload.action === "version_created";
    }
}

export type StyleguideComponentEventPayload = EventPayload<
    StyleguideComponentEventDescriptor,
    StyleguideContext,
    ComponentResource
>;
export const styleguideComponentNotificationHandler = new StyleguideComponentNotificationHandler();