import {
    ResourceType,
    WebhookEvent,
    EventPayload,
    ProjectContext,
    EventType
} from "../../../messagingTypes";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, AdaptiveCard } from "../utils";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_BASE_URL } from "../../../../../config";
import { URL } from "url";

type ProjectColorEventDescriptor = {
    type: EventType.PROJECT_COLOR;
    action: "created" | "updated";
};

type ProjectColorResource = {
    id: string;
    type: ResourceType.COLOR;
    data: {
        id: string;
        created: number;
        name: string;
        r: number;
        g: number;
        b: number;
        a: number;
    };
};

class ProjectColorNotificationHandler extends NotificationHandler {
    delay = SHORT_DELAY;
    private getActionText(action: ProjectColorEventDescriptor["action"]): string {
        if (action === "created") {
            return "added";
        }

        return "updated";
    }

    private getWebappURL(
        events: WebhookEvent<ProjectColorEventPayload>[]
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
        webappURL.pathname = `project/${projectId}/styleguide/colors`;
        events.forEach(event => webappURL.searchParams.append("cid", event.payload.resource.id));
        return webappURL.toString();
    }

    private getMacAppURL(
        events: WebhookEvent<ProjectColorEventPayload>[]
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
        return `${ZEPLIN_MAC_APP_BASE_URL}colors?pid=${projectId}&cids=${events.map(event => event.payload.resource.id).join(",")}`;
    }

    getTeamsMessage(
        events: WebhookEvent<ProjectColorEventPayload>[]
    ): AdaptiveCard {
        const [pivotEvent] = events;
        const {
            payload: {
                action,
                context: {
                    project: { name: projectName }
                },
                resource: {
                    data: {
                        name: pivotColorName
                    }
                }
            }
        } = pivotEvent;

        return commonTeamsCard({
            title: projectName,
            text: events.length === 1
                ? `**${pivotColorName}** is ${this.getActionText(action)}! 🏃‍♂`
                : `**${events.length} new colors** are ${this.getActionText(action)}! 🏃‍♂`,
            subText: "Make sure your stylesheets are up to date!",
            links: [{
                title: "Open in Web",
                url: this.getWebappURL(events)
            }, {
                title: "Open in App",
                url: this.getMacAppURL(events)
            }]
        });
    }
}

export type ProjectColorEventPayload = EventPayload<
    ProjectColorEventDescriptor,
    ProjectContext,
    ProjectColorResource
>;
export const projectColorNotificationHandler = new ProjectColorNotificationHandler();