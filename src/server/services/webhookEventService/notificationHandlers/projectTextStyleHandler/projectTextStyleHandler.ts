import {
    ProjectTextStyleCreatedEvent,
    ProjectTextStyleUpdatedEvent,
    WebhookEvent
} from "@zeplin/sdk";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForZeplinApp, getWebAppURL } from "../zeplinURL";
import { getTextStyleUpdateMessage } from "../getStyleUpdateMessage";

type Event = ProjectTextStyleCreatedEvent | ProjectTextStyleUpdatedEvent;

class ProjectTextStyleHandler extends NotificationHandler<Event> {
    delay = SHORT_DELAY;
    private getText(events: Event[]): string {
        const [{
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
        }] = events;
        const actionText = action === "created" ? "added to" : "updated in";
        return events.length === 1
            ? md`**${pivotTextStyleName}** is ${actionText} _${projectName}_! ${getRandomEmoji()}`
            : md`**${events.length} text styles** are ${actionText} _${projectName}_! ${getRandomEmoji()}`;
    }

    private getSectionText(events: Event[]): string {
        const [{
            context: {
                project: {
                    platform: projectPlatform
                }
            }
        }] = events;

        return getTextStyleUpdateMessage(projectPlatform);
    }

    private getWebappURL(
        events: Event[]
    ): string {
        const [{
            context: {
                project: {
                    id: projectId
                }
            }
        }] = events;
        const pathname = `project/${projectId}/styleguide/textstyles`;
        const searchParams = {
            tsid: events.map(({ resource: { id } }) => id)
        };

        return getWebAppURL(pathname, searchParams);
    }

    private getZeplinAppURI(
        events: Event[]
    ): string {
        const [{
            context: {
                project: {
                    id: projectId
                }
            }
        }] = events;
        const searchParams = {
            pid: projectId,
            tsids: events.map(({ resource: { id } }) => id)
        };

        return getRedirectURLForZeplinApp("textStyles", searchParams);
    }

    shouldHandleEvent(event: WebhookEvent): event is Event {
        return event.action !== "deleted";
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
                url: this.getZeplinAppURI(events)
            }, {
                title: "Open in Web",
                url: this.getWebappURL(events)
            }]
        });
    }
}

export const projectTextStyleHandler = new ProjectTextStyleHandler();
