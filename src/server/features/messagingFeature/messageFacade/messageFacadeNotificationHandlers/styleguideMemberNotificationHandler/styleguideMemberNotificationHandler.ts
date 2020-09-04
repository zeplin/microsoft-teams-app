import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { StyleguideMemberEvent, WebhookEvent } from "../../../../../adapters/zeplin/types";
import { LONG_DELAY } from "../constants";

class StyleguideMemberNotificationHandler extends NotificationHandler {
    delay = LONG_DELAY;

    private getText(events: StyleguideMemberEvent[]): string {
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

    getTeamsMessage(events: StyleguideMemberEvent[]): MessageCard {
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

export const styleguideMemberNotificationHandler = new StyleguideMemberNotificationHandler();
