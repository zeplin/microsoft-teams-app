import { createHash } from "crypto";
import { ProjectScreenCreatedEvent, WebhookEvent } from "@zeplin/sdk";

import { GroupingKeyParams, NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { MEDIUM_DELAY } from "../constants";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForZeplinApp, getWebAppURL } from "../zeplinURL";

const IMAGE_LIMIT = 5;

class ProjectScreenHandler extends NotificationHandler<ProjectScreenCreatedEvent> {
    delay = MEDIUM_DELAY;

    private getText(events: ProjectScreenCreatedEvent[]): string {
        const [{
            context: {
                project: {
                    name: projectName
                }
            },
            resource: {
                data: {
                    name: screenName
                }
            }
        }] = events;
        return events.length === 1
            ? md`**${screenName}** is added to _${projectName}_! ${getRandomEmoji()}`
            : md`**${events.length} screens** are added to _${projectName}_! ${getRandomEmoji()}`;
    }

    private getImages(events: ProjectScreenCreatedEvent[]): string[] {
        // Take last 5 screen images
        return events
            .sort((e1, e2) => e2.timestamp - e1.timestamp)
            .map(event => event.resource.data.image?.thumbnails?.small)
            .filter((val): val is string => Boolean(val))
            .slice(0, IMAGE_LIMIT);
    }

    private getWebappURL(events: ProjectScreenCreatedEvent[]): string {
        const [{
            context: {
                project: {
                    id: projectId
                }
            },
            resource: {
                id: screenId
            }
        }] = events;

        let pathname;
        let searchParams;

        if (events.length === 1) {
            pathname = `project/${projectId}/screen/${screenId}`;
        } else {
            pathname = `project/${projectId}`;
            searchParams = {
                sid: events.map(({ resource: { id } }) => id)
            };
        }
        const utmParams = { utmCampaign: "comment_reply" };

        return getWebAppURL(pathname, searchParams, utmParams);
    }

    private getZeplinAppURI(events: ProjectScreenCreatedEvent[]): string {
        const [{
            context: {
                project: {
                    id: projectId
                }
            }
        }] = events;

        let resource;
        let searchParams;

        if (events.length === 1) {
            resource = "screen";
            searchParams = {
                pid: projectId,
                sid: events[0].resource.id
            };
        } else {
            resource = "project";
            searchParams = {
                pid: projectId,
                sids: events.map(({ resource: { id } }) => id)
            };
        }
        const utmParams = { utmCampaign: "comment_reply" };

        return getRedirectURLForZeplinApp(resource, searchParams, utmParams);
    }

    getGroupingKey({
        webhookId,
        event: {
            event: eventType,
            action,
            context: {
                version: {
                    commit
                }
            }
        }
    }: GroupingKeyParams<ProjectScreenCreatedEvent>): string {
        const hashedCommit = commit?.message
            ? createHash("md5").update(commit.message).digest("hex")
            : "no-commit";
        return `${webhookId}:${hashedCommit}:${eventType}:${action}`;
    }

    getTeamsMessage(events: ProjectScreenCreatedEvent[]): MessageCard {
        return commonTeamsCard({
            text: this.getText(events),
            images: this.getImages(events),
            links: [{
                title: "Open in App",
                url: this.getZeplinAppURI(events)
            }, {
                title: "Open in Web",
                url: this.getWebappURL(events)
            }]
        });
    }

    shouldHandleEvent(event: WebhookEvent): event is ProjectScreenCreatedEvent {
        return event.action === "created";
    }
}

export const projectScreenHandler = new ProjectScreenHandler();
