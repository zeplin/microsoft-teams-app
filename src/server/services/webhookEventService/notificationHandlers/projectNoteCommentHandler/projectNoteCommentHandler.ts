import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import {
    NoteCommentCreateEvent,
    WebhookEvent
} from "../../../../adapters/zeplin/types";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForZeplinApp, getWebAppURL } from "../zeplinURL";

class ProjectNoteCommentHandler extends NotificationHandler<NoteCommentCreateEvent> {
    delay = 0;

    private getText(event: NoteCommentCreateEvent): string {
        const {
            payload: {
                context: {
                    project: {
                        name: projectName
                    },
                    screen: {
                        name: screenName
                    },
                    note: {
                        order
                    }
                },
                actor: {
                    user: {
                        username
                    }
                }
            }
        } = event;
        return md`**${username as string}** replied to note _#${order}_ on _${screenName}_ screen in _${projectName}_. ${getRandomEmoji()}`;
    }

    private getSectionText(event: NoteCommentCreateEvent): string {
        const {
            payload: {
                resource: {
                    data: {
                        content: commentContent
                    }
                }
            }
        } = event;
        return commentContent;
    }

    private getWebappURL(event: NoteCommentCreateEvent): string {
        const {
            payload: {
                context: {
                    screen: {
                        id: screenId
                    },
                    project: {
                        id: projectId
                    },
                    note: {
                        id: noteId
                    }
                },
                resource: {
                    id: commentId
                }
            }
        } = event;
        const pathname = `project/${projectId}/screen/${screenId}`;
        const searchParams = {
            did: noteId,
            cmid: commentId
        };

        return getWebAppURL(pathname, searchParams);
    }

    private getMacAppURL(event: NoteCommentCreateEvent): string {
        const {
            payload: {
                context: {
                    project: {
                        id: projectId
                    },
                    screen: {
                        id: screenId
                    },
                    note: {
                        id: noteId
                    }
                },
                resource: {
                    id: commentId
                }
            }
        } = event;
        const searchParams = {
            pid: projectId,
            sid: screenId,
            did: noteId,
            cmids: commentId
        };

        return getRedirectURLForZeplinApp("dot", searchParams);
    }

    shouldHandleEvent(event: WebhookEvent): event is NoteCommentCreateEvent {
        return event.payload.action === "created";
    }

    getGroupingKey(event: WebhookEvent): string {
        return `${event.webhookId}:${event.deliveryId}`;
    }

    getTeamsMessage(events: NoteCommentCreateEvent[]): MessageCard {
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

export const projectNoteCommentHandler = new ProjectNoteCommentHandler();
