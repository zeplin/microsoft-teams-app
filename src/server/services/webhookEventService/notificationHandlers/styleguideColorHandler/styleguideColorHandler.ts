import {
    WebhookEvent,
    StyleguideColorCreateEvent,
    StyleguideColorUpdateEvent
} from "../../../../adapters/zeplin/types";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForZeplinApp, getWebAppURL } from "../zeplinURL";
import { getColorUpdateMessage } from "../getStyleUpdateMessage";

type Event = StyleguideColorCreateEvent | StyleguideColorUpdateEvent;

class StyleguideColorHandler extends NotificationHandler<Event> {
    delay = SHORT_DELAY;
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
                        name: pivotColorName
                    }
                }
            }
        }] = events;
        const actionText = action === "created" ? "added to" : "updated in";
        return events.length === 1
            ? md`**${pivotColorName}** is ${actionText} _${styleguideName}_! ${getRandomEmoji()}`
            : md`**${events.length} colors** are ${actionText} _${styleguideName}_! ${getRandomEmoji()}`;
    }

    private getSectionText(events: Event[]): string {
        const [{
            payload: {
                context: {
                    styleguide: {
                        platform: styleguidePlatform
                    }
                }
            }
        }] = events;

        return getColorUpdateMessage(styleguidePlatform);
    }

    private getWebappURL(
        events: Event[]
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
        const pathname = `styleguide/${styleguideId}/colors`;
        const searchParams = {
            cid: events.map(event => event.payload.resource.id)
        };

        return getWebAppURL(pathname, searchParams);
    }

    private getZeplinAppURI(
        events: Event[]
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
        const searchParams = {
            stid: styleguideId,
            cids: events.map(event => event.payload.resource.id)
        };

        return getRedirectURLForZeplinApp("colors", searchParams);
    }

    shouldHandleEvent(event: WebhookEvent): event is Event {
        return event.payload.action !== "deleted";
    }

    getTeamsMessage(
        events: Event[]
    ): MessageCard {
        return commonTeamsCard({
            text: this.getText(events),
            section: {
                text: this.getSectionText(events)
            },
            links: [{
                title: "Open in App",
                url: this.getZeplinAppURI(events)
            }, {
                title: "Open in Web",
                url: this.getWebappURL(events)
            }]
        });
    }
}

export const styleguideColorHandler = new StyleguideColorHandler();
