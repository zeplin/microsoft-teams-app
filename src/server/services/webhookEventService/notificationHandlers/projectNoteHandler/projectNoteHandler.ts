import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { NoteCreateEvent, WebhookEvent } from "../../../../adapters/zeplin/types";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForMacApp, getWebAppURL } from "../zeplinURL";

class ProjectNoteHandler extends NotificationHandler<NoteCreateEvent> {
    // We want to send project note events immediately
    delay = 0;

    private getText(event: NoteCreateEvent): string {
        const {
            payload: {
                context: {
                    project: {
                        name: projectName
                    },
                    screen: {
                        name: screenName
                    }
                },
                actor: {
                    user: {
                        username
                    }
                }
            }
        } = event;
        return md`**${username as string}** added a note on _${screenName}_ screen in _${projectName}_. ${getRandomEmoji()}`;
    }

    private getSectionText(event: NoteCreateEvent): string {
        const {
            payload: {
                resource: {
                    data: {
                        comments: [{ content: commentContent }]
                    }
                }
            }
        } = event;
        return commentContent;
    }

    private getWebappURL(event: NoteCreateEvent): string {
        const {
            payload: {
                context: {
                    screen: {
                        id: screenId
                    },
                    project: {
                        id: projectId
                    }
                },
                resource: {
                    id: noteId
                }
            }
        } = event;
        const pathname = `project/${projectId}/screen/${screenId}`;
        const searchParams = {
            did: noteId
        };

        return getWebAppURL(pathname, searchParams);
    }

    private getMacAppURL(event: NoteCreateEvent): string {
        const {
            payload: {
                context: {
                    project: {
                        id: projectId
                    },
                    screen: {
                        id: screenId
                    }
                },
                resource: {
                    id: noteId
                }
            }
        } = event;
        const searchParams = {
            pid: projectId,
            sid: screenId,
            did: noteId
        };

        return getRedirectURLForMacApp("dot", searchParams);
    }

    shouldHandleEvent(event: WebhookEvent): event is NoteCreateEvent {
        return event.payload.action === "created";
    }

    // A unique grouping key so that it won't be grouped with any other events
    getGroupingKey(event: WebhookEvent): string {
        return `${event.webhookId}:${event.deliveryId}`;
    }

    getTeamsMessage(events: NoteCreateEvent[]): MessageCard {
        const [event] = events;
        return commonTeamsCard({
            text: this.getText(event),
            section: {
                text: this.getSectionText(event)
            },
            links: [{
                title: "Open in App",
                url: this.getMacAppURL(event)
            }, {
                title: "Open in Web",
                url: this.getWebappURL(event)
            }]
        });
    }
}

export const projectNoteHandler = new ProjectNoteHandler();
