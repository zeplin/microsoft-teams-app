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

type StyleguideTextStyleEventDescriptor = {
    type: EventType.STYLEGUIDE_TEXT_STYLE;
    action: "created" | "updated";
};

type StyleguideTextStyleResource = {
    id: string;
    type: ResourceType.TEXT_STYLE;
    data: {
        id: string;
        created: number;
        name: string;
        postscript_name: string;
        font_family: string;
        font_size: number;
        font_weight: number;
        font_style: string;
        font_stretch: number;
        line_height?: number;
        letter_spacing?: number;
        text_align?: string;
        color?: {
            name?: string;
            r: number;
            g: number;
            b: number;
            a: number;
        };
    };
};

class StyleguideTextStyleNotificationHandler extends NotificationHandler {
    delay = SHORT_DELAY;
    private getText(events: WebhookEvent<StyleguideTextStyleEventPayload>[]): string {
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
                        name: pivotTextStyleName
                    }
                }
            }
        }] = events;
        const actionText = action === "created" ? "added" : "updated";
        return events.length === 1
            ? `**${pivotTextStyleName}** is ${actionText} in _${styleguideName}_! 🏃‍♂`
            : `**${events.length} text styles** are ${actionText} in _${styleguideName}_! 🏃‍♂`;
    }

    private getWebappURL(
        events: WebhookEvent<StyleguideTextStyleEventPayload>[]
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
        webappURL.pathname = `styleguide/${styleguideId}/styleguide/textstyles`;
        events.forEach(event => webappURL.searchParams.append("tsid", event.payload.resource.id));
        return webappURL.toString();
    }

    private getMacAppURL(
        events: WebhookEvent<StyleguideTextStyleEventPayload>[]
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
        return `${ZEPLIN_MAC_APP_URL_SCHEME}textStyles?stid=${styleguideId}&tsids=${events.map(event => event.payload.resource.id).join(",")}`;
    }

    getTeamsMessage(
        events: WebhookEvent<StyleguideTextStyleEventPayload>[]
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

export type StyleguideTextStyleEventPayload = EventPayload<
    StyleguideTextStyleEventDescriptor,
    StyleguideContext,
    StyleguideTextStyleResource
>;
export const styleguideTextStyleNotificationHandler = new StyleguideTextStyleNotificationHandler();