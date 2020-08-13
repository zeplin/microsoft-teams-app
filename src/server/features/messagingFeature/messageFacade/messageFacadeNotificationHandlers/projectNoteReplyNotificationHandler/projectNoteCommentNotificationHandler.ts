import { NotificationHandler } from "../NotificationHandler";
import { AdaptiveCard, commonTeamsCard } from "../teamsCardTemplates";
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

type ProjectNoteCommentEventDescriptor = {
    type: EventType.PROJECT_NOTE_COMMENT;
    action: "created";
}

class ProjectNoteCommentNotificationHandler extends NotificationHandler {
    delay: 0;

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

    getGroupingKey(event: WebhookEvent): string {
        return event.deliveryId;
    }

    getTeamsMessage(events: WebhookEvent<ProjectNoteCommentEventPayload>[]): AdaptiveCard {
        if (events.length > 1) {
            // TODO: Log that there was somehow grouping done for this notification
        }

        const [event] = events;
        const {
            payload: {
                context: {
                    project: {
                        id: projectId,
                        name: projectName
                    },
                    screen: {
                        id: screenId,
                        name: screenName
                    },
                    note: {
                        id: noteId,
                        order
                    }
                },
                resource: {
                    id: commentId,
                    data: {
                        content: commentContent
                    }
                },
                actor: {
                    user: {
                        username
                    }
                }
            }
        } = event;
        const cardText = `**${username}** replied to note _#${order}_ on _${screenName}_ screen in _${projectName}_. 🏃‍♂`;
        return commonTeamsCard({
            text: cardText,
            sectionText: commentContent,
            links: [{
                title: "Open in App",
                url: `${ZEPLIN_MAC_APP_URL_SCHEME}dot?pid=${projectId}&sid=${screenId}&did=${noteId}&cmids=${commentId}`
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