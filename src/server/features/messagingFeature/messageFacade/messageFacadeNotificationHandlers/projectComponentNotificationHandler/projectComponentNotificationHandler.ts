import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { ProjectComponentEvent } from "../../../../../adapters/zeplin/types";
import { MEDIUM_DELAY } from "../constants";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../../config";
import { getMacAppRedirectURL } from "../getMacAppRedirectURL";

const IMAGE_LIMIT = 5;

class ProjectComponentNotificationHandler extends NotificationHandler {
    delay = MEDIUM_DELAY;

    private getText(events: ProjectComponentEvent[]): string {
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
                        name: componentName
                    }
                }
            }
        }] = events;
        const actionText = action === "created" ? "added" : "updated";
        return events.length === 1
            ? `**${componentName}** is ${actionText} in _${projectName}_! 🏃‍♂️`
            : `**${events.length}${action === "created" ? " new" : ""} components** are ${actionText} in _${projectName}_! 🏃‍♂️`;
    }

    private getImages(events: ProjectComponentEvent[]): string[] {
        // Take last 5 screen images
        return events
            .sort((e1, e2) => e2.payload.timestamp - e1.payload.timestamp)
            .map(event => event.payload.resource.data.image.original_url)
            .filter(Boolean)
            .slice(0, IMAGE_LIMIT);
    }

    private getWebappURL(events: ProjectComponentEvent[]): string {
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
        webappURL.pathname = `project/${projectId}/styleguide/components`;
        events.forEach(event => webappURL.searchParams.append("coid", event.payload.resource.id));
        return webappURL.toString();
    }

    private getMacAppURL(events: ProjectComponentEvent[]): string {
        const [{
            payload: {
                context: {
                    project: {
                        id: projectId
                    }
                }
            }
        }] = events;
        return getMacAppRedirectURL(`${ZEPLIN_MAC_APP_URL_SCHEME}://components?pid=${projectId}&coids=${events.map(event => event.payload.resource.id).join(",")}`);
    }

    getTeamsMessage(events: ProjectComponentEvent[]): MessageCard {
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

    shouldHandleEvent(event: ProjectComponentEvent): boolean {
        return event.payload.action === "created" || event.payload.action === "version_created";
    }
}

export const projectComponentNotificationHandler = new ProjectComponentNotificationHandler();
