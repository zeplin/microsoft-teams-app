import { NotificationHandler } from "../NotificationHandler";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { ProjectMemberEvent, WebhookEvent } from "../../../../../adapters/zeplin/types";
import { LONG_DELAY } from "../constants";

class ProjectMemberNotificationHandler extends NotificationHandler {
    delay = LONG_DELAY;

    private getText(events: ProjectMemberEvent[]): string {
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
            ? `**${username}** just joined _${projectName}_.`
            : `**${events.length} new users** just joined _${projectName}_`;
    }

    getTeamsMessage(events: ProjectMemberEvent[]): MessageCard {
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

export const projectMemberNotificationHandler = new ProjectMemberNotificationHandler();
