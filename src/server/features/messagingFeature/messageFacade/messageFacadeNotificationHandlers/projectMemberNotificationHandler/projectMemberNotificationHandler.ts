import { NotificationHandler } from "../NotificationHandler";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { WebhookEvent, EventType, EventPayload, ProjectContext } from "../../../messagingTypes";
import { LONG_DELAY } from "../constants";
import { ProjectMemberResource } from "../resources/projectMemberResource";

type ProjectMemberEventDescriptor = {
    type: EventType.PROJECT_MEMBER;
    action: "invited";
};

class ProjectMemberNotificationHandler extends NotificationHandler {
    delay = LONG_DELAY;

    private getText(events: WebhookEvent<ProjectMemberEventPayload>[]): string {
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

    getTeamsMessage(events: WebhookEvent<ProjectMemberEventPayload>[]): MessageCard {
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

export type ProjectMemberEventPayload = EventPayload<
    ProjectMemberEventDescriptor,
    ProjectContext,
    ProjectMemberResource
>;
export const projectMemberNotificationHandler = new ProjectMemberNotificationHandler();