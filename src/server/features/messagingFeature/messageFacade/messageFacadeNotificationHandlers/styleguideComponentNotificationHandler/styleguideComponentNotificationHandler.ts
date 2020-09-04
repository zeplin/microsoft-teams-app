import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { StyleguideComponentEvent, WebhookEvent } from "../../../../../adapters/zeplin/types";
import { MEDIUM_DELAY } from "../constants";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../../config";
import { getMacAppRedirectURL } from "../getMacAppRedirectURL";

const IMAGE_LIMIT = 5;

class StyleguideComponentNotificationHandler extends NotificationHandler {
    delay = MEDIUM_DELAY;

    private getText(events: StyleguideComponentEvent[]): string {
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

    private getImages(events: StyleguideComponentEvent[]): string[] {
        // Take last 5 screen images
        return events
            .sort((e1, e2) => e2.payload.timestamp - e1.payload.timestamp)
            .map(event => event.payload.resource.data.image.original_url)
            .filter(Boolean)
            .slice(0, IMAGE_LIMIT);
    }

    private getWebappURL(events: StyleguideComponentEvent[]): string {
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

    private getMacAppURL(events: StyleguideComponentEvent[]): string {
        const [{
            payload: {
                context: {
                    styleguide: {
                        id: styleguideId
                    }
                }
            }
        }] = events;
        return getMacAppRedirectURL(`${ZEPLIN_MAC_APP_URL_SCHEME}://components?stid=${styleguideId}&coids=${events.map(event => event.payload.resource.id).join(",")}`);
    }

    getTeamsMessage(events: StyleguideComponentEvent[]): MessageCard {
        return commonTeamsCard({
            text: this.getText(events),
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

    shouldHandleEvent(event: WebhookEvent): boolean {
        return event.payload.action === "created" || event.payload.action === "version_created";
    }
}

export const styleguideComponentNotificationHandler = new StyleguideComponentNotificationHandler();
