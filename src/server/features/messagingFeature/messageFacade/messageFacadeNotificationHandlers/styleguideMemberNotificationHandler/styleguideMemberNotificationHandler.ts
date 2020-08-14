import { NotificationHandler } from "../NotificationHandler";
import { AdaptiveCard, commonTeamsCard } from "../teamsCardTemplates";
import { WebhookEvent, EventType, EventPayload, StyleguideContext } from "../../../messagingTypes";
import { LONG_DELAY } from "../constants";
import { StyleguideMemberResource } from "../resources/styleguideMemberResource";

type StyleguideMemberEventDescriptor = {
    type: EventType.STYLEGUIDE_MEMBER;
    action: "invited";
};

class StyleguideMemberNotificationHandler extends NotificationHandler {
    delay = LONG_DELAY;

    private getText(events: WebhookEvent<StyleguideMemberEventPayload>[]): string {
        const [{
            payload: {
                context: {
                    styleguide: {
                        name: styleguideName
                    }
                },
                resource: {
                    data: {
                        user: {
                            username
                        }
                    }
                }
            }
        }] = events;
        return events.length === 1
            ? `**${username}** just joined _${styleguideName}_.`
            : `**${events.length} new users** just joined _${styleguideName}_`;
    }

    getTeamsMessage(events: WebhookEvent<StyleguideMemberEventPayload>[]): AdaptiveCard {
        return commonTeamsCard({
            text: this.getText(events),
            section: {
                text: "Say hi 👋"
            }
        });
    }

    shouldHandleEvent(event: WebhookEvent): boolean {
        return event.payload.action === "invited";
    }
}

export type StyleguideMemberEventPayload = EventPayload<
    StyleguideMemberEventDescriptor,
    StyleguideContext,
    StyleguideMemberResource
>;
export const styleguideMemberNotificationHandler = new StyleguideMemberNotificationHandler();