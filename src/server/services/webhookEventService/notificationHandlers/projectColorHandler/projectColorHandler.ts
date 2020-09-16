import {
    WebhookEvent,
    ProjectColorCreateEvent,
    ProjectColorUpdateEvent
} from "../../../../adapters/zeplin/types";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../config";
import { URL } from "url";
import { getMacAppRedirectURL } from "../getMacAppRedirectURL";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";

type Event = ProjectColorCreateEvent | ProjectColorUpdateEvent;

class ProjectColorHandler extends NotificationHandler<Event> {
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
                        name: pivotColorName
                    }
                }
            }
        }] = events;
        const actionText = action === "created" ? "added" : "updated";
        return events.length === 1
            ? md`**${pivotColorName}** is ${actionText} in _${projectName}_! ${getRandomEmoji()}`
            : md`**${events.length} new colors** are ${actionText} in _${projectName}_! ${getRandomEmoji()}`;
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
        webappURL.pathname = `project/${projectId}/styleguide/colors`;
        events.forEach(event => webappURL.searchParams.append("cid", event.payload.resource.id));
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
        return getMacAppRedirectURL(`${ZEPLIN_MAC_APP_URL_SCHEME}://colors?pid=${projectId}&cids=${events.map(event => event.payload.resource.id).join(",")}`);
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

export const projectColorHandler = new ProjectColorHandler();
