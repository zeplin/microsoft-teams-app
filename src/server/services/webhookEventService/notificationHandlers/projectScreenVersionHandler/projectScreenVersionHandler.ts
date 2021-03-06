import { createHash } from "crypto";
import { ProjectScreenVersionCreatedEvent, WebhookEvent } from "@zeplin/sdk";

import { GroupingKeyParams, NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { MEDIUM_DELAY } from "../constants";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForZeplinApp, getWebAppURL } from "../zeplinURL";

const IMAGE_LIMIT = 5;

class ProjectScreenVersionHandler extends NotificationHandler<ProjectScreenVersionCreatedEvent> {
    delay = MEDIUM_DELAY;

    private getText(events: ProjectScreenVersionCreatedEvent[]): string {
        const [{
            context: {
                screen: {
                    name: screenName,
                    variant: screenVariant
                },
                project: {
                    name: projectName
                }
            }
        }] = events;

        if (events.length > 1) {
            const inSameVariantGroup = events.every(event =>
                event.context.screen.variant?.group.id === screenVariant?.group.id
            );

            return (screenVariant && inSameVariantGroup)
                ? md`**${events.length} variants** of **${screenVariant.group.name}** are updated in _${projectName}_! ${getRandomEmoji()}`
                : md`**${events.length} screens** are updated in _${projectName}_! ${getRandomEmoji()}`;
        }
        return (screenVariant)
            ? md`**${screenVariant.value}** variant of **${screenVariant.group.name}** is updated in _${projectName}_! ${getRandomEmoji()}`
            : md`**${screenName}** is updated in _${projectName}_! ${getRandomEmoji()}`;
    }

    private getImages(events: ProjectScreenVersionCreatedEvent[]): string[] {
        // Take last 5 screen images
        return events
            .sort((e1, e2) => e2.timestamp - e1.timestamp)
            .map(event => event.context.screen.image.thumbnails?.small)
            .filter((val): val is string => Boolean(val))
            .slice(0, IMAGE_LIMIT);
    }

    private getWebappURL(events: ProjectScreenVersionCreatedEvent[]): string {
        const [{
            context: {
                screen: {
                    id: screenId
                },
                project: {
                    id: projectId
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
                sid: events.map(event => event.context.screen.id)
            };
        }

        return getWebAppURL(pathname, searchParams);
    }

    private getZeplinAppURIURI(events: ProjectScreenVersionCreatedEvent[]): string {
        const [{
            context: {
                screen: {
                    id: screenId
                },
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
                sid: screenId
            };
        } else {
            resource = "project";
            searchParams = {
                pid: projectId,
                sids: events.map(event => event.context.screen.id)
            };
        }

        return getRedirectURLForZeplinApp(resource, searchParams);
    }

    getGroupingKey({
        webhookId,
        event: {
            event: eventType,
            action,
            resource: {
                data: {
                    commit
                }
            }
        }
    }: GroupingKeyParams<ProjectScreenVersionCreatedEvent>): string {
        const hashedCommit = commit?.message
            ? createHash("md5").update(commit.message).digest("hex")
            : "no-commit";
        return `${webhookId}:${hashedCommit}:${eventType}:${action}`;
    }

    getTeamsMessage(events: ProjectScreenVersionCreatedEvent[]): MessageCard {
        const [{
            resource: {
                data: {
                    commit
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

    shouldHandleEvent(event: WebhookEvent): event is ProjectScreenVersionCreatedEvent {
        return event.action === "created";
    }
}

export const projectScreenVersionHandler = new ProjectScreenVersionHandler();
