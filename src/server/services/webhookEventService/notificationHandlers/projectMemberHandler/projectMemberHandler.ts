import { NotificationHandler } from "../NotificationHandler";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { ProjectMemberInviteEvent, WebhookEvent } from "../../../../adapters/zeplin/types";
import { LONG_DELAY } from "../constants";
import { md } from "../md";

class ProjectMemberHandler extends NotificationHandler<ProjectMemberInviteEvent> {
    delay = LONG_DELAY;

    private getText(events: ProjectMemberInviteEvent[]): string {
        const [{
            payload: {
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
            }
        }] = events;
        return events.length === 1
            ? md`**${username || "A new member"}** just joined _${projectName}_.`
            : md`**${events.length} new members** just joined _${projectName}_`;
    }

    getTeamsMessage(events: ProjectMemberInviteEvent[]): MessageCard {
        return commonTeamsCard({
            text: this.getText(events),
            section: {
                text: "Say hi 👋"
            }
        });
    }

    shouldHandleEvent(event: WebhookEvent): event is ProjectMemberInviteEvent {
        return event.payload.action === "invited";
    }
}

export const projectMemberHandler = new ProjectMemberHandler();
