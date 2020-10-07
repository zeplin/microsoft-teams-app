import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { createHash } from "crypto";
import {
    ProjectComponentCreateEvent,
    ProjectComponentVersionCreateEvent
} from "../../../../adapters/zeplin/types";
import { MEDIUM_DELAY } from "../constants";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForZeplinApp, getWebAppURL } from "../zeplinURL";

const IMAGE_LIMIT = 5;

type Event = ProjectComponentCreateEvent | ProjectComponentVersionCreateEvent;

class ProjectComponentHandler extends NotificationHandler<Event> {
    delay = MEDIUM_DELAY;

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
                        name: componentName
                    }
                }
            }
        }] = events;
        const actionText = action === "created" ? "added to" : "updated in";
        return events.length === 1
            ? md`**${componentName}** is ${actionText} _${projectName}_! ${getRandomEmoji()}`
            : md`**${events.length} components** are ${actionText} _${projectName}_! ${getRandomEmoji()}`;
    }

    private getImages(events: Event[]): string[] {
        // Take last 5 screen images
        return events
            .sort((e1, e2) => e2.payload.timestamp - e1.payload.timestamp)
            .map(event => event.payload.resource.data.image?.thumbnails?.small)
            .filter((val): val is string => Boolean(val))
            .slice(0, IMAGE_LIMIT);
    }

    private getWebappURL(events: Event[]): string {
        const [{
            payload: {
                context: {
                    project: {
                        id: projectId
                    }
                }
            }
        }] = events;
        const pathname = `project/${projectId}/styleguide/components`;
        const searchParams = {
            coid: events.map(event => event.payload.resource.id)
        };

        return getWebAppURL(pathname, searchParams);
    }

    private getZeplinAppURIURI(events: Event[]): string {
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
            coids: events.map(event => event.payload.resource.id)
        };

        return getRedirectURLForZeplinApp("components", searchParams);
    }

    getGroupingKey(event: Event): string {
        const {
            webhookId,
            payload: {
                event: eventType,
                action,
                context: {
                    version: {
                        commit
                    }
                }
            }
        } = event;
        const hashedCommit = commit?.message
            ? createHash("md5").update(commit.message).digest("hex")
            : "no-commit";
        return `${webhookId}:${hashedCommit}:${eventType}:${action}`;
    }

    getTeamsMessage(events: Event[]): MessageCard {
        return commonTeamsCard({
            text: this.getText(events),
            images: this.getImages(events),
            links: [{
                title: "Open in App",
                url: this.getZeplinAppURIURI(events)
            }, {
                title: "Open in Web",
                url: this.getWebappURL(events)
            }]
        });
    }

    shouldHandleEvent(event: Event): event is Event {
        return event.payload.action === "created" || event.payload.action === "version_created";
    }
}

export const projectComponentHandler = new ProjectComponentHandler();
