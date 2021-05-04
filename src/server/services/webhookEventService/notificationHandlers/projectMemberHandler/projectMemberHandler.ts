import { ProjectMemberInvitedEvent, WebhookEvent } from "@zeplin/sdk";

import { NotificationHandler } from "../NotificationHandler";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { LONG_DELAY } from "../constants";
import { md } from "../md";

class ProjectMemberHandler extends NotificationHandler<ProjectMemberInvitedEvent> {
    delay = LONG_DELAY;

    private getText(events: ProjectMemberInvitedEvent[]): string {
        const [{
            context: {
                project: {
                    name: projectName
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
            ? md`**${username || "A new teammate"}** just joined _${projectName}_.`
            : md`**${events.length} teammates** just joined _${projectName}_`;
    }

    getTeamsMessage(events: ProjectMemberInvitedEvent[]): MessageCard {
        return commonTeamsCard({
            text: this.getText(events),
            section: {
                text: "Say hi 👋"
            }
        });
    }

    shouldHandleEvent(event: WebhookEvent): event is ProjectMemberInvitedEvent {
        return event.action === "invited";
    }
}

export const projectMemberHandler = new ProjectMemberHandler();
