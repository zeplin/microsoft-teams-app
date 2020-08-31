import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import {
    WebhookEvent,
    EventType,
    EventPayload,
    ProjectContext,
    ScreenContext,
    NoteContext
} from "../../../messagingTypes";
import { ScreenNoteCommentResource } from "../resources/screenNoteCommentResource";
import { ZEPLIN_MAC_APP_URL_SCHEME, ZEPLIN_WEB_APP_BASE_URL } from "../../../../../config";
import { getMacAppRedirectURL } from "../getMacAppRedirectURL";

type ProjectNoteCommentEventDescriptor = {
    type: EventType.PROJECT_NOTE_COMMENT;
    action: "created";
}

class ProjectNoteCommentNotificationHandler extends NotificationHandler {
    delay: 0;
    private getText(event: WebhookEvent<ProjectNoteCommentEventPayload>): string {
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
        return `**${username}** replied to note _#${order}_ on _${screenName}_ screen in _${projectName}_. 🏃‍♂`;
    }

    private getSectionText(event: WebhookEvent<ProjectNoteCommentEventPayload>): string {
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

    private getWebappURL(event: WebhookEvent<ProjectNoteCommentEventPayload>): string {
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
        const webappURL = new URL(ZEPLIN_WEB_APP_BASE_URL);
        webappURL.pathname = `project/${projectId}/screen/${screenId}`;
        webappURL.searchParams.set("did", noteId);
        webappURL.searchParams.set("cmid", commentId);
        return webappURL.toString();
    }

    private getMacAppURL(event: WebhookEvent<ProjectNoteCommentEventPayload>): string {
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
        return getMacAppRedirectURL(`${ZEPLIN_MAC_APP_URL_SCHEME}://dot?pid=${projectId}&sid=${screenId}&did=${noteId}&cmids=${commentId}`);
    }

    shouldHandleEvent(event: WebhookEvent): boolean {
        return event.payload.action === "created";
    }

    getGroupingKey(event: WebhookEvent): string {
        return event.deliveryId;
    }

    getTeamsMessage(events: WebhookEvent<ProjectNoteCommentEventPayload>[]): MessageCard {
        if (events.length > 1) {
            // TODO: Log that there was somehow grouping done for this notification
        }

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

export type ProjectNoteCommentEventPayload = EventPayload<
    ProjectNoteCommentEventDescriptor,
    ProjectContext & ScreenContext & NoteContext,
    ScreenNoteCommentResource
>;
export const projectNoteCommentNotificationHandler = new ProjectNoteCommentNotificationHandler();