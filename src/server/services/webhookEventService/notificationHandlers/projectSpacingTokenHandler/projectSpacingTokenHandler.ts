import {
    WebhookEvent,
    ProjectSpacingTokenCreateEvent,
    ProjectSpacingTokenUpdateEvent
} from "../../../../adapters/zeplin/types";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../config";
import { URL } from "url";
import { getMacAppRedirectURL } from "../getMacAppRedirectURL";

type Event = ProjectSpacingTokenCreateEvent | ProjectSpacingTokenUpdateEvent;

class ProjectSpacingTokenHandler extends NotificationHandler<Event> {
    delay = SHORT_DELAY;
    private getText(events: Event[]): string {
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
                        name: pivotSpacingTokenName
                    }
                }
            }
        }] = events;
        const actionText = action === "created" ? "added" : "updated";
        return events.length === 1
            ? `**${pivotSpacingTokenName}** is ${actionText} in _${projectName}_! 🏃‍♂`
            : `**${events.length} spacing tokens** are ${actionText} in _${projectName}_! 🏃‍♂`;
    }

    private getWebappURL(
        events: Event[]
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
        webappURL.pathname = `project/${projectId}/styleguide/spacing`;
        events.forEach(event => webappURL.searchParams.append("sptid", event.payload.resource.id));
        return webappURL.toString();
    }

    private getMacAppURL(
        events: Event[]
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
        return getMacAppRedirectURL(`${ZEPLIN_MAC_APP_URL_SCHEME}://spacing?pid=${projectId}&sptids=${events.map(event => event.payload.resource.id).join(",")}`);
    }

    shouldHandleEvent(event: WebhookEvent): event is Event {
        return event.payload.action !== "deleted";
    }

    getTeamsMessage(
        events: Event[]
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

export const projectSpacingTokenHandler = new ProjectSpacingTokenHandler();
