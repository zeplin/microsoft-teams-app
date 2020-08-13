import { NotificationHandler } from "../NotificationHandler";
import { AdaptiveCard, commonTeamsCard } from "../teamsCardTemplates";
import {
    EventPayload,
    EventType,
    ProjectContext,
    ScreenContext,
    WebhookEvent
} from "../../../messagingTypes";
import { ScreenNoteResource } from "../resources";
import { ZEPLIN_WEB_APP_BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME } from "../../../../../config";

type ProjectNoteEventDescriptor = {
    type: EventType.PROJECT_NOTE;
    action: "created";
}

class ProjectNoteNotificationHandler extends NotificationHandler {
    // We want to send project note events immediately
    delay = 0;

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

    // A unique grouping key so that it won't be grouped with any other events
    getGroupingKey(event: WebhookEvent): string {
        return event.deliveryId;
    }

    getTeamsMessage(events: WebhookEvent<ProjectNoteEventPayload>[]): AdaptiveCard {
        if (events.length > 1) {
            // TODO: Log this situation since we don't want it to happen
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
                    }
                },
                resource: {
                    id: noteId,
                    data: {
                        comments: [{ content: commentContent }]
                    }
                },
                actor: {
                    user: {
                        username
                    }
                }
            }
        } = event;
        const cardText = `**${username}** added a note on _${screenName}_ screen in _${projectName}_. 🏃‍♂`;
        return commonTeamsCard({
            text: cardText,
            sectionText: commentContent,
            links: [{
                title: "Open in App",
                url: `${ZEPLIN_MAC_APP_URL_SCHEME}dot?pid=${projectId}&sid=${screenId}&did=${noteId}`
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