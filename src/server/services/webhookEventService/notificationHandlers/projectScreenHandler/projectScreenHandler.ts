import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { ScreenCreateEvent, WebhookEvent } from "../../../../adapters/zeplin/types";
import { MEDIUM_DELAY } from "../constants";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForMacApp, getWebAppURL } from "../zeplinURL";

const IMAGE_LIMIT = 5;

class ProjectScreenHandler extends NotificationHandler<ScreenCreateEvent> {
    delay = MEDIUM_DELAY;

    private getText(events: ScreenCreateEvent[]): string {
        const [{
            payload: {
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
            }
        }] = events;
        return events.length === 1
            ? md`**${screenName}** is added to _${projectName}_! ${getRandomEmoji()}`
            : md`**${events.length} screens** are added to _${projectName}_! ${getRandomEmoji()}`;
    }

    private getImages(events: ScreenCreateEvent[]): string[] {
        // Take last 5 screen images
        return events
            .sort((e1, e2) => e2.payload.timestamp - e1.payload.timestamp)
            .map(event => event.payload.resource.data.image?.thumbnails?.small)
            .filter((val): val is string => Boolean(val))
            .slice(0, IMAGE_LIMIT);
    }

    private getWebappURL(events: ScreenCreateEvent[]): string {
        const [{
            payload: {
                context: {
                    project: {
                        id: projectId
                    }
                },
                resource: {
                    id: screenId
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
                sid: events.map(event => event.payload.resource.id)
            };
        }

        return getWebAppURL(pathname, searchParams);
    }

    private getMacAppURL(events: ScreenCreateEvent[]): string {
        const [{
            payload: {
                context: {
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
                sid: events[0].payload.resource.id
            };
        } else {
            resource = "project";
            searchParams = {
                pid: projectId,
                sids: events.map(event => event.payload.resource.id)
            };
        }

        return getRedirectURLForMacApp(resource, searchParams);
    }

    getTeamsMessage(events: ScreenCreateEvent[]): MessageCard {
        return commonTeamsCard({
            text: this.getText(events),
            images: this.getImages(events),
            links: [{
                title: "Open in App",
                url: this.getMacAppURL(events)
            }, {
                title: "Open in Web",
                url: this.getWebappURL(events)
            }]
        });
    }

    shouldHandleEvent(event: WebhookEvent): event is ScreenCreateEvent {
        return event.payload.action === "created";
    }
}

export const projectScreenHandler = new ProjectScreenHandler();
