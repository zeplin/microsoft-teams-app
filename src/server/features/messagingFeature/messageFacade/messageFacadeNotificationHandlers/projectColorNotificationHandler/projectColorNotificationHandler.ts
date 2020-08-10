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
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../../config";
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
    private getText(events: WebhookEvent<ProjectColorEventPayload>[]): string {
        const [{
            payload: {
                action,
                resource: {
                    data: {
                        name: pivotColorName
                    }
                }
            }
        }] = events;
        const actionText = action === "created" ? "added" : "updated";
        return events.length === 1
            ? `**${pivotColorName}** is ${actionText}! 🏃‍♂`
            : `**${events.length} new colors** are ${actionText}! 🏃‍♂`;
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
        return `${ZEPLIN_MAC_APP_URL_SCHEME}colors?pid=${projectId}&cids=${events.map(event => event.payload.resource.id).join(",")}`;
    }

    getTeamsMessage(
        events: WebhookEvent<ProjectColorEventPayload>[]
    ): AdaptiveCard {
        const [{
            payload: {
                context: {
                    project: { name: projectName }
                }
            }
        }] = events;

        return commonTeamsCard({
            title: projectName,
            text: this.getText(events),
            sectionText: "Make sure your stylesheets are up to date!",
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