import { createHash } from "crypto";

import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { ScreenVersionCreateEvent, WebhookEvent } from "../../../../adapters/zeplin/types";
import { MEDIUM_DELAY } from "../constants";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../config";
import { getMacAppRedirectURL } from "../getMacAppRedirectURL";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";

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
        const webappURL = new URL(ZEPLIN_WEB_APP_BASE_URL);
        if (events.length === 1) {
            webappURL.pathname = `project/${projectId}/screen/${screenId}`;
        } else {
            webappURL.pathname = `project/${projectId}`;
            events.forEach(event => webappURL.searchParams.append("sid", event.payload.context.screen.id));
        }
        return webappURL.toString();
    }

    private getMacAppURL(events: ScreenVersionCreateEvent[]): string {
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

        if (events.length === 1) {
            return getMacAppRedirectURL(`${ZEPLIN_MAC_APP_URL_SCHEME}://screen?pid=${projectId}&sid=${screenId}`);
        }

        return getMacAppRedirectURL(`${ZEPLIN_MAC_APP_URL_SCHEME}://project?pid=${projectId}&sids=${events.map(event => event.payload.context.screen.id).join(",")}`);
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
                url: this.getMacAppURL(events)
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
