import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import {
    StyleguideComponentVersionCreateEvent,
    StyleguideComponentCreateEvent,
    WebhookEvent
} from "../../../../adapters/zeplin/types";
import { MEDIUM_DELAY } from "../constants";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../config";
import { getMacAppRedirectURL } from "../getMacAppRedirectURL";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";

const IMAGE_LIMIT = 5;

type Event = StyleguideComponentCreateEvent | StyleguideComponentVersionCreateEvent;

class StyleguideComponentHandler extends NotificationHandler<Event> {
    delay = MEDIUM_DELAY;

    private getText(events: Event[]): string {
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
            ? md`**${componentName}** is ${actionText} in _${styleguideName}_! ${getRandomEmoji()}️`
            : md`**${events.length}${action === "created" ? " new" : ""} components** are ${actionText} in _${styleguideName}_! ${getRandomEmoji()}️`;
    }

    private getImages(events: Event[]): string[] {
        // Take last 5 screen images
        return events
            .sort((e1, e2) => e2.payload.timestamp - e1.payload.timestamp)
            .map(event => event.payload.resource.data.image?.original_url)
            .filter((val): val is string => Boolean(val))
            .slice(0, IMAGE_LIMIT);
    }

    private getWebappURL(events: Event[]): string {
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

    private getMacAppURL(events: Event[]): string {
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

    getTeamsMessage(events: Event[]): MessageCard {
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

    shouldHandleEvent(event: WebhookEvent): event is Event {
        return event.payload.action === "created" || event.payload.action === "version_created";
    }
}

export const styleguideComponentHandler = new StyleguideComponentHandler();
