import { StyleguideMemberInvitedEvent, WebhookEvent } from "@zeplin/sdk";

import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { LONG_DELAY } from "../constants";
import { md } from "../md";

class StyleguideMemberHandler extends NotificationHandler<StyleguideMemberInvitedEvent> {
    delay = LONG_DELAY;

    private getText(events: StyleguideMemberInvitedEvent[]): string {
        const [{
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
        }] = events;
        return events.length === 1
            ? md`**${username || "A new teammate"}** just joined _${styleguideName}_.`
            : md`**${events.length} teammates** just joined _${styleguideName}_`;
    }

    getTeamsMessage(events: StyleguideMemberInvitedEvent[]): MessageCard {
        return commonTeamsCard({
            text: this.getText(events),
            section: {
                text: "Say hi 👋"
            }
        });
    }

    shouldHandleEvent(event: WebhookEvent): event is StyleguideMemberInvitedEvent {
        return event.action === "invited";
    }
}

export const styleguideMemberHandler = new StyleguideMemberHandler();
