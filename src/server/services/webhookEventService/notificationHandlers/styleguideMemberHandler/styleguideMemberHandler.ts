import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { StyleguideMemberInviteEvent, WebhookEvent } from "../../../../adapters/zeplin/types";
import { LONG_DELAY } from "../constants";
import { md } from "../md";

class StyleguideMemberHandler extends NotificationHandler<StyleguideMemberInviteEvent> {
    delay = LONG_DELAY;

    private getText(events: StyleguideMemberInviteEvent[]): string {
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
            ? md`**${username || "A new teammate"}** just joined _${styleguideName}_.`
            : md`**${events.length} teammates** just joined _${styleguideName}_`;
    }

    getTeamsMessage(events: StyleguideMemberInviteEvent[]): MessageCard {
        return commonTeamsCard({
            text: this.getText(events),
            section: {
                text: "Say hi 👋"
            }
        });
    }

    shouldHandleEvent(event: WebhookEvent): event is StyleguideMemberInviteEvent {
        return event.payload.action === "invited";
    }
}

export const styleguideMemberHandler = new StyleguideMemberHandler();
