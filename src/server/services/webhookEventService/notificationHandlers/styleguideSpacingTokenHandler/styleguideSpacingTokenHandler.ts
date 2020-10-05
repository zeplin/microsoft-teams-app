import {
    StyleguideSpacingTokenCreateEvent,
    StyleguideSpacingTokenUpdateEvent,
    WebhookEvent
} from "../../../../adapters/zeplin/types";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForZeplinApp, getWebAppURL } from "../zeplinURL";
import { getSpacingTokenUpdateMessage } from "../getStyleUpdateMessage";

type Event = StyleguideSpacingTokenCreateEvent | StyleguideSpacingTokenUpdateEvent;

class StyleguideSpacingTokenHandler extends NotificationHandler<Event> {
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
                        name: pivotSpacingTokenName
                    }
                }
            }
        }] = events;
        const actionText = action === "created" ? "added to" : "updated in";
        return events.length === 1
            ? md`**${pivotSpacingTokenName}** is ${actionText} _${styleguideName}_! ${getRandomEmoji()}`
            : md`**${events.length} spacing tokens** are ${actionText} _${styleguideName}_! ${getRandomEmoji()}`;
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

        return getSpacingTokenUpdateMessage(styleguidePlatform);
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
        const pathname = `styleguide/${styleguideId}/spacing`;
        const searchParams = {
            sptid: events.map(event => event.payload.resource.id)
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
            sptids: events.map(event => event.payload.resource.id)
        };

        return getRedirectURLForZeplinApp("spacing", searchParams);
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

export const styleguideSpacingTokenHandler = new StyleguideSpacingTokenHandler();
