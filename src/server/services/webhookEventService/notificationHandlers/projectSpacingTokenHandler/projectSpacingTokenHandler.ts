import {
    WebhookEvent,
    ProjectSpacingTokenCreateEvent,
    ProjectSpacingTokenUpdateEvent
} from "../../../../adapters/zeplin/types";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";
import { commonTeamsCard, MessageCard } from "../teamsCardTemplates";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForZeplinApp, getWebAppURL } from "../zeplinURL";
import { getSpacingTokenUpdateMessage } from "../getStyleUpdateMessage";

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
        const actionText = action === "created" ? "added to" : "updated in";
        return events.length === 1
            ? md`**${pivotSpacingTokenName}** is ${actionText} _${projectName}_! ${getRandomEmoji()}`
            : md`**${events.length} spacing tokens** are ${actionText} _${projectName}_! ${getRandomEmoji()}`;
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

        return getSpacingTokenUpdateMessage(projectPlatform);
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
        const pathname = `project/${projectId}/styleguide/spacing`;
        const searchParams = {
            sptid: events.map(event => event.payload.resource.id)
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
            sptids: events.map(event => event.payload.resource.id)
        };

        return getRedirectURLForZeplinApp("spacing", searchParams);
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

export const projectSpacingTokenHandler = new ProjectSpacingTokenHandler();
