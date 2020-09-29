import {
    ProjectTextStyleCreateEvent,
    ProjectTextStyleUpdateEvent,
    WebhookEvent
} from "../../../../adapters/zeplin/types";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForMacApp, getWebAppURL } from "../zeplinURL";

type Event = ProjectTextStyleCreateEvent | ProjectTextStyleUpdateEvent;

class ProjectTextStyleHandler extends NotificationHandler<Event> {
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
                        name: pivotTextStyleName
                    }
                }
            }
        }] = events;
        const actionText = action === "created" ? "added to" : "updated in";
        return events.length === 1
            ? md`**${pivotTextStyleName}** is ${actionText} _${projectName}_! ${getRandomEmoji()}`
            : md`**${events.length} text styles** are ${actionText} _${projectName}_! ${getRandomEmoji()}`;
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
        const pathname = `project/${projectId}/styleguide/textstyles`;
        const searchParams = {
            tsid: events.map(event => event.payload.resource.id)
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
            tsids: events.map(event => event.payload.resource.id)
        };

        return getRedirectURLForMacApp("textStyles", searchParams);
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

export const projectTextStyleHandler = new ProjectTextStyleHandler();
