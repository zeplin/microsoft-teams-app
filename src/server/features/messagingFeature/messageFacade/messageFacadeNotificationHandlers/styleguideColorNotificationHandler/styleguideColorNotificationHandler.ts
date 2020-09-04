import { WebhookEvent, StyleguideColorEvent } from "../../../../../adapters/zeplin/types";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../../config";
import { URL } from "url";
import { getMacAppRedirectURL } from "../getMacAppRedirectURL";

class StyleguideColorNotificationHandler extends NotificationHandler {
    delay = SHORT_DELAY;
    private getText(events: StyleguideColorEvent[]): string {
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
        events: StyleguideColorEvent[]
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
        events: StyleguideColorEvent[]
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
        return getMacAppRedirectURL(`${ZEPLIN_MAC_APP_URL_SCHEME}://colors?stid=${styleguideId}&cids=${events.map(event => event.payload.resource.id).join(",")}`);
    }

    shouldHandleEvent(event: WebhookEvent): boolean {
        return event.payload.action !== "deleted";
    }

    getTeamsMessage(
        events: StyleguideColorEvent[]
    ): MessageCard {
        return commonTeamsCard({
            text: this.getText(events),
            section: {
                text: "Make sure your stylesheets are up to date!"
            },
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

export const styleguideColorNotificationHandler = new StyleguideColorNotificationHandler();
