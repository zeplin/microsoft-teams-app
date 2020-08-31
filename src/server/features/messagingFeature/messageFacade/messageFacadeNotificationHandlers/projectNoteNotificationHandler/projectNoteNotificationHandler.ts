import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import {
    EventPayload,
    EventType,
    ProjectContext,
    ScreenContext,
    WebhookEvent
} from "../../../messagingTypes";
import { ScreenNoteResource } from "../resources";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../../config";
import { getMacAppRedirectURL } from "../getMacAppRedirectURL";

type ProjectNoteEventDescriptor = {
    type: EventType.PROJECT_NOTE;
    action: "created";
}

class ProjectNoteNotificationHandler extends NotificationHandler {
    // We want to send project note events immediately
    delay = 0;

    private getText(event: WebhookEvent<ProjectNoteEventPayload>): string {
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
        return `**${username}** added a note on _${screenName}_ screen in _${projectName}_. 🏃‍♂`;
    }

    private getSectionText(event: WebhookEvent<ProjectNoteEventPayload>): string {
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

    private getWebappURL(event: WebhookEvent<ProjectNoteEventPayload>): string {
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
        const webappURL = new URL(ZEPLIN_WEB_APP_BASE_URL);
        webappURL.pathname = `project/${projectId}/screen/${screenId}`;
        webappURL.searchParams.set("did", noteId);
        return webappURL.toString();
    }

    private getMacAppURL(event: WebhookEvent<ProjectNoteEventPayload>): string {
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
        return getMacAppRedirectURL(`${ZEPLIN_MAC_APP_URL_SCHEME}dot?pid=${projectId}&sid=${screenId}&did=${noteId}`);
    }

    shouldHandleEvent(event: WebhookEvent): boolean {
        return event.payload.action === "created";
    }

    // A unique grouping key so that it won't be grouped with any other events
    getGroupingKey(event: WebhookEvent): string {
        return event.deliveryId;
    }

    getTeamsMessage(events: WebhookEvent<ProjectNoteEventPayload>[]): MessageCard {
        if (events.length > 1) {
            // TODO: Log this situation since we don't want it to happen
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

export type ProjectNoteEventPayload = EventPayload<
    ProjectNoteEventDescriptor,
    ProjectContext & ScreenContext,
    ScreenNoteResource
>;
export const projectNoteNotificationHandler = new ProjectNoteNotificationHandler();