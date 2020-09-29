import {
    WebhookEvent,
    ProjectColorCreateEvent,
    ProjectColorUpdateEvent
} from "../../../../adapters/zeplin/types";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { getRedirectURLForMacApp, getWebAppURL } from "../zeplinURL";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getColorUpdateMessage } from "../getStyleUpdateMessage";

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
        const actionText = action === "created" ? "added to" : "updated in";
        return events.length === 1
            ? md`**${pivotColorName}** is ${actionText} _${projectName}_! ${getRandomEmoji()}`
            : md`**${events.length} colors** are ${actionText} _${projectName}_! ${getRandomEmoji()}`;
    }

    private getSectionText(events: Event[]): string {
        const [{
            payload: {
                context: {
                    project: {
                        platform: projectPlatform
                    }
                }
            }
        }] = events;

        return getColorUpdateMessage(projectPlatform);
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
        const pathname = `project/${projectId}/styleguide/colors`;
        const searchParams = {
            cid: events.map(event => event.payload.resource.id)
        };

        return getWebAppURL(pathname, searchParams);
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
        const searchParams = {
            pid: projectId,
            cids: events.map(event => event.payload.resource.id)
        };

        return getRedirectURLForMacApp("colors", searchParams);
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
                text: this.getSectionText(events)
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
