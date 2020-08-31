import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import {
    WebhookEvent,
    EventType,
    EventPayload,
    ProjectContext
} from "../../../messagingTypes";
import { MEDIUM_DELAY } from "../constants";
import { ScreenResource } from "../resources/screenResource";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../../config";
import { getMacAppRedirectURL } from "../getMacAppRedirectURL";

const IMAGE_LIMIT = 5;

type ProjectScreenEventDescriptor = {
    type: EventType.PROJECT_SCREEN;
    action: "created";
};

class ProjectScreenNotificationHandler extends NotificationHandler {
    delay = MEDIUM_DELAY;

    private getText(events: WebhookEvent<ProjectScreenEventPayload>[]): string {
        const [{
            payload: {
                context: {
                    project: {
                        name: projectName
                    }
                },
                resource: {
                    data: {
                        name: screenName
                    }
                }
            }
        }] = events;
        return events.length === 1
            ? `**${screenName}** is added in _${projectName}_! 🏃‍♂️`
            : `**${events.length} new screens** are added in _${projectName}_! 🏃‍♂`;
    }

    private getImages(events: WebhookEvent<ProjectScreenEventPayload>[]): string[] {
        // Take last 5 screen images
        return events
            .sort((e1, e2) => e2.payload.timestamp - e1.payload.timestamp)
            .map(event => event.payload.resource.data.image.original_url)
            .filter(Boolean)
            .slice(0, IMAGE_LIMIT);
    }

    private getWebappURL(events: WebhookEvent<ProjectScreenEventPayload>[]): string {
        const [{
            payload: {
                context: {
                    project: {
                        id: projectId
                    }
                },
                resource: {
                    id: screenId
                }
            }
        }] = events;
        const webappURL = new URL(ZEPLIN_WEB_APP_BASE_URL);
        if (events.length === 1) {
            webappURL.pathname = `project/${projectId}/screen/${screenId}`;
        } else {
            webappURL.pathname = `project/${projectId}`;
            events.forEach(event => webappURL.searchParams.append("sid", event.payload.resource.id));
        }
        return webappURL.toString();
    }

    private getMacAppURL(events: WebhookEvent<ProjectScreenEventPayload>[]): string {
        const [{
            payload: {
                context: {
                    project: {
                        id: projectId
                    }
                }
            }
        }] = events;
        if (events.length === 1) {
            return getMacAppRedirectURL(`${ZEPLIN_MAC_APP_URL_SCHEME}://screen?pid=${projectId}&sid=${events[0].payload.resource.id}`);
        }

        return getMacAppRedirectURL(`${ZEPLIN_MAC_APP_URL_SCHEME}://project?pid=${projectId}&sids=${events.map(event => event.payload.resource.id).join(",")}`);
    }

    getTeamsMessage(events: WebhookEvent<ProjectScreenEventPayload>[]): MessageCard {
        return commonTeamsCard({
            text: this.getText(events),
            images: this.getImages(events),
            links: [{
                title: "Open in App",
                url: this.getMacAppURL(events)
            }, {
                title: "Open in Web",
                url: this.getWebappURL(events)
            }]
        });
    }

    shouldHandleEvent(event: WebhookEvent): boolean {
        return event.payload.action === "created";
    }
}

export type ProjectScreenEventPayload = EventPayload<
    ProjectScreenEventDescriptor,
    ProjectContext,
    ScreenResource
>
export const projectScreenNotificationHandler = new ProjectScreenNotificationHandler();