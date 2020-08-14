import { NotificationHandler } from "../NotificationHandler";
import { AdaptiveCard, commonTeamsCard } from "../teamsCardTemplates";
import {
    WebhookEvent,
    EventType,
    EventPayload,
    ProjectContext,
    ScreenContext
} from "../../../messagingTypes";
import { MEDIUM_DELAY } from "../constants";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../../config";
import { ScreenVersionSummaryResource } from "../resources/screenVersionSummaryResource";

const IMAGE_LIMIT = 5;

type ProjectScreenVersionEventDescriptor = {
    type: EventType.PROJECT_SCREEN_VERSION;
    action: "created";
};

class ProjectScreenVersionNotificationHandler extends NotificationHandler {
    delay = MEDIUM_DELAY;

    private getText(events: WebhookEvent<ProjectScreenVersionEventPayload>[]): string {
        const [{
            payload: {
                context: {
                    screen: {
                        name: screenName
                    },
                    project: {
                        name: projectName
                    }
                }
            }
        }] = events;
        return events.length === 1
            ? `**${screenName}** is updated in _${projectName}_! 🏃‍♂️`
            : `**${events.length} screens** are updated in _${projectName}_! 🏃‍♂`;
    }

    private getImages(events: WebhookEvent<ProjectScreenVersionEventPayload>[]): string[] {
        // Take last 5 screen images
        return events
            .sort((e1, e2) => e2.payload.timestamp - e1.payload.timestamp)
            .map(event => event.payload.context.screen.image.original_url)
            .filter(Boolean)
            .slice(0, IMAGE_LIMIT);
    }

    private getWebappURL(events: WebhookEvent<ProjectScreenVersionEventPayload>[]): string {
        const [{
            payload: {
                context: {
                    screen: {
                        id: screenId
                    },
                    project: {
                        id: projectId
                    }
                }
            }
        }] = events;
        const webappURL = new URL(ZEPLIN_WEB_APP_BASE_URL);
        if (events.length === 1) {
            webappURL.pathname = `project/${projectId}/screen/${screenId}`;
        } else {
            webappURL.pathname = `project/${projectId}`;
            events.forEach(event => webappURL.searchParams.append("sid", event.payload.context.screen.id));
        }
        return webappURL.toString();
    }

    private getMacAppURL(events: WebhookEvent<ProjectScreenVersionEventPayload>[]): string {
        const [{
            payload: {
                context: {
                    screen: {
                        id: screenId
                    },
                    project: {
                        id: projectId
                    }
                }
            }
        }] = events;

        if (events.length === 1) {
            return `${ZEPLIN_MAC_APP_URL_SCHEME}screen?pid=${projectId}&sid=${screenId}`;
        }
        return `${ZEPLIN_MAC_APP_URL_SCHEME}project?pid=${projectId}&sids=${events.map(event => event.payload.context.screen.id).join(",")}`;
    }

    getTeamsMessage(events: WebhookEvent<ProjectScreenVersionEventPayload>[]): AdaptiveCard {
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

export type ProjectScreenVersionEventPayload = EventPayload<
    ProjectScreenVersionEventDescriptor,
    ProjectContext & ScreenContext,
    ScreenVersionSummaryResource
>
export const projectScreenVersionNotificationHandler = new ProjectScreenVersionNotificationHandler();