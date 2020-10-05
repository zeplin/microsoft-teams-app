import { createHash } from "crypto";

import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { ScreenVersionCreateEvent, WebhookEvent } from "../../../../adapters/zeplin/types";
import { MEDIUM_DELAY } from "../constants";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForZeplinApp, getWebAppURL } from "../zeplinURL";

const IMAGE_LIMIT = 5;

class ProjectScreenVersionHandler extends NotificationHandler<ScreenVersionCreateEvent> {
    delay = MEDIUM_DELAY;

    private getText(events: ScreenVersionCreateEvent[]): string {
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
            ? md`**${screenName}** is updated in _${projectName}_! ${getRandomEmoji()}`
            : md`**${events.length} screens** are updated in _${projectName}_! ${getRandomEmoji()}`;
    }

    private getImages(events: ScreenVersionCreateEvent[]): string[] {
        // Take last 5 screen images
        return events
            .sort((e1, e2) => e2.payload.timestamp - e1.payload.timestamp)
            .map(event => event.payload.context.screen.image.thumbnails?.small)
            .filter((val): val is string => Boolean(val))
            .slice(0, IMAGE_LIMIT);
    }

    private getWebappURL(events: ScreenVersionCreateEvent[]): string {
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

        let pathname;
        let searchParams;

        if (events.length === 1) {
            pathname = `project/${projectId}/screen/${screenId}`;
        } else {
            pathname = `project/${projectId}`;
            searchParams = {
                sid: events.map(event => event.payload.context.screen.id)
            };
        }

        return getWebAppURL(pathname, searchParams);
    }

    private getZeplinAppURIURI(events: ScreenVersionCreateEvent[]): string {
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

        let resource;
        let searchParams;

        if (events.length === 1) {
            resource = "screen";
            searchParams = {
                pid: projectId,
                sid: screenId
            };
        } else {
            resource = "project";
            searchParams = {
                pid: projectId,
                sids: events.map(event => event.payload.context.screen.id)
            };
        }

        return getRedirectURLForZeplinApp(resource, searchParams);
    }

    getGroupingKey(event: ScreenVersionCreateEvent): string {
        const {
            webhookId,
            payload: {
                event: eventType,
                action,
                resource: {
                    data: {
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

    getTeamsMessage(events: ScreenVersionCreateEvent[]): MessageCard {
        const [{
            payload: {
                resource: {
                    data: {
                        commit
                    }
                }
            }
        }] = events;
        return commonTeamsCard({
            text: this.getText(events),
            images: this.getImages(events),
            section: commit?.message ? {
                title: "**Commit message**",
                text: commit.message
            } : undefined,
            links: [{
                title: "Open in App",
                url: this.getZeplinAppURIURI(events)
            }, {
                title: "Open in Web",
                url: this.getWebappURL(events)
            }]
        });
    }

    shouldHandleEvent(event: WebhookEvent): event is ScreenVersionCreateEvent {
        return event.payload.action === "created";
    }
}

export const projectScreenVersionHandler = new ProjectScreenVersionHandler();
