import {
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
import { SpacingTokenResource } from "../resources";

type StyleguideSpacingTokenEventDescriptor = {
    type: EventType.STYLEGUIDE_SPACING_TOKEN;
    action: "created" | "updated";
};

class StyleguideSpacingTokenNotificationHandler extends NotificationHandler {
    delay = SHORT_DELAY;
    private getText(events: WebhookEvent<StyleguideSpacingTokenEventPayload>[]): string {
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
        const actionText = action === "created" ? "added" : "updated";
        return events.length === 1
            ? `**${pivotSpacingTokenName}** is ${actionText} in _${styleguideName}_! 🏃‍♂`
            : `**${events.length} spacing tokens** are ${actionText} in _${styleguideName}_! 🏃‍♂`;
    }

    private getWebappURL(
        events: WebhookEvent<StyleguideSpacingTokenEventPayload>[]
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
        webappURL.pathname = `styleguide/${styleguideId}/spacing`;
        events.forEach(event => webappURL.searchParams.append("sptid", event.payload.resource.id));
        return webappURL.toString();
    }

    private getMacAppURL(
        events: WebhookEvent<StyleguideSpacingTokenEventPayload>[]
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
        return `${ZEPLIN_MAC_APP_URL_SCHEME}spacing?stid=${styleguideId}&sptids=${events.map(event => event.payload.resource.id).join(",")}`;
    }

    shouldHandleEvent(event: WebhookEvent): boolean {
        return event.payload.action !== "deleted";
    }

    getTeamsMessage(
        events: WebhookEvent<StyleguideSpacingTokenEventPayload>[]
    ): AdaptiveCard {
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

export type StyleguideSpacingTokenEventPayload = EventPayload<
    StyleguideSpacingTokenEventDescriptor,
    StyleguideContext,
    SpacingTokenResource
>;
export const styleguideSpacingTokenNotificationHandler = new StyleguideSpacingTokenNotificationHandler();