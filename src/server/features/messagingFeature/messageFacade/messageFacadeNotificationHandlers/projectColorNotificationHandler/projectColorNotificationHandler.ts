import { WebhookEvent, ProjectColorEvent } from "../../../../../adapters/zeplin/types";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../../config";
import { URL } from "url";
import { getMacAppRedirectURL } from "../getMacAppRedirectURL";

class ProjectColorNotificationHandler extends NotificationHandler {
    delay = SHORT_DELAY;
    private getText(events: ProjectColorEvent[]): string {
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
                        name: pivotColorName
                    }
                }
            }
        }] = events;
        const actionText = action === "created" ? "added" : "updated";
        return events.length === 1
            ? `**${pivotColorName}** is ${actionText} in _${projectName}_! 🏃‍♂`
            : `**${events.length} new colors** are ${actionText} in _${projectName}_! 🏃‍♂`;
    }

    private getWebappURL(
        events: ProjectColorEvent[]
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
        events: ProjectColorEvent[]
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
        return getMacAppRedirectURL(`${ZEPLIN_MAC_APP_URL_SCHEME}://colors?pid=${projectId}&cids=${events.map(event => event.payload.resource.id).join(",")}`);
    }

    shouldHandleEvent(event: WebhookEvent): boolean {
        return event.payload.action !== "deleted";
    }

    getTeamsMessage(
        events: ProjectColorEvent[]
    ): MessageCard {
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

export const projectColorNotificationHandler = new ProjectColorNotificationHandler();
