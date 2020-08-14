import {
    WebhookEvent,
    EventPayload,
    ProjectContext,
    EventType
} from "../../../messagingTypes";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, AdaptiveCard } from "../teamsCardTemplates";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../../config";
import { URL } from "url";
import { TextStyleResource } from "../resources";

type ProjectTextStyleEventDescriptor = {
    type: EventType.PROJECT_TEXT_STYLE;
    action: "created" | "updated";
};

class ProjectTextStyleNotificationHandler extends NotificationHandler {
    delay = SHORT_DELAY;
    private getText(events: WebhookEvent<ProjectTextStyleEventPayload>[]): string {
        const [{
            payload: {
                action,
                context: {
                    project: {
                        name: projectName
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
            ? `**${pivotTextStyleName}** is ${actionText} in _${projectName}_! 🏃‍♂`
            : `**${events.length} text styles** are ${actionText} in _${projectName}_! 🏃‍♂`;
    }

    private getWebappURL(
        events: WebhookEvent<ProjectTextStyleEventPayload>[]
    ): string {
        const [{
            payload: {
                context: {
                    project: {
                        id: projectId
                    }
                }
            }
        }] = events;
        const webappURL = new URL(ZEPLIN_WEB_APP_BASE_URL);
        webappURL.pathname = `project/${projectId}/styleguide/textstyles`;
        events.forEach(event => webappURL.searchParams.append("tsid", event.payload.resource.id));
        return webappURL.toString();
    }

    private getMacAppURL(
        events: WebhookEvent<ProjectTextStyleEventPayload>[]
    ): string {
        const [{
            payload: {
                context: {
                    project: {
                        id: projectId
                    }
                }
            }
        }] = events;
        return `${ZEPLIN_MAC_APP_URL_SCHEME}textStyles?pid=${projectId}&tsids=${events.map(event => event.payload.resource.id).join(",")}`;
    }

    shouldHandleEvent(event: WebhookEvent): boolean {
        return event.payload.action !== "deleted";
    }

    getTeamsMessage(
        events: WebhookEvent<ProjectTextStyleEventPayload>[]
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

export type ProjectTextStyleEventPayload = EventPayload<
    ProjectTextStyleEventDescriptor,
    ProjectContext,
    TextStyleResource
>;
export const projectTextStyleNotificationHandler = new ProjectTextStyleNotificationHandler();