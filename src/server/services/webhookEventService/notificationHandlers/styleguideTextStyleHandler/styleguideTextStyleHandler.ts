import {
    StyleguideTextStyleCreatedEvent,
    StyleguideTextStyleUpdatedEvent,
    WebhookEvent
} from "@zeplin/sdk";

import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForZeplinApp, getWebAppURL } from "../zeplinURL";

type Event = StyleguideTextStyleCreatedEvent | StyleguideTextStyleUpdatedEvent;

class StyleguideTextStyleHandler extends NotificationHandler<Event> {
    delay = SHORT_DELAY;
    private getText(events: Event[]): string {
        const [{
            action,
            context: {
                styleguide: {
                    name: styleguideName
                }
            },
            resource: {
                data: {
                    name: pivotTextStyleName
                }
            }
        }] = events;
        const actionText = action === "created" ? "added to" : "updated in";
        return events.length === 1
            ? md`**${pivotTextStyleName}** is ${actionText} _${styleguideName}_! ${getRandomEmoji()}`
            : md`**${events.length} text styles** are ${actionText} _${styleguideName}_! ${getRandomEmoji()}`;
    }

    private getWebappURL(
        events: Event[]
    ): string {
        const [{
            context: {
                styleguide: {
                    id: styleguideId
                }
            }
        }] = events;
        const pathname = `styleguide/${styleguideId}/textstyles`;
        const searchParams = {
            tsid: events.map(({ resource: { id } }) => id)
        };

        return getWebAppURL(pathname, searchParams);
    }

    private getZeplinAppURI(
        events: Event[]
    ): string {
        const [{
            context: {
                styleguide: {
                    id: styleguideId
                }
            }
        }] = events;
        const searchParams = {
            stid: styleguideId,
            tsids: events.map(({ resource: { id } }) => id)
        };

        return getRedirectURLForZeplinApp("textStyles", searchParams);
    }

    shouldHandleEvent(event: WebhookEvent): event is Event {
        return event.action !== "deleted";
    }

    getTeamsMessage(
        events: Event[]
    ): MessageCard {
        return commonTeamsCard({
            text: this.getText(events),
            section: {
                text: "Make sure your stylesheets are up to date!"
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

export const styleguideTextStyleHandler = new StyleguideTextStyleHandler();
