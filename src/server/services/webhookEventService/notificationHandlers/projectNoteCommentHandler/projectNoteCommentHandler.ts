import {
    ProjectNoteCommentCreatedEvent,
    WebhookEvent
} from "@zeplin/sdk";

import { GroupingKeyParams, NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForZeplinApp, getWebAppURL } from "../zeplinURL";

class ProjectNoteCommentHandler extends NotificationHandler<ProjectNoteCommentCreatedEvent> {
    delay = 0;

    private getText(event: ProjectNoteCommentCreatedEvent): string {
        const {
            context: {
                project: {
                    name: projectName
                },
                screen: {
                    name: screenName,
                    variant: screenVariant
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
        } = event;
        return (screenVariant)
            ? md`**${username as string}** replied to note _#${order}_ on _${screenVariant.value}_ variant of _${screenVariant.group.name}_ in _${projectName}_. ${getRandomEmoji()}`
            : md`**${username as string}** replied to note _#${order}_ on _${screenName}_ screen in _${projectName}_. ${getRandomEmoji()}`;
    }

    private getSectionText(event: ProjectNoteCommentCreatedEvent): string {
        const {
            resource: {
                data: {
                    content: commentContent
                }
            }
        } = event;
        return commentContent;
    }

    private getWebappURL(event: ProjectNoteCommentCreatedEvent): string {
        const {
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
        } = event;
        const pathname = `project/${projectId}/screen/${screenId}`;
        const searchParams = {
            did: noteId,
            cmid: commentId
        };
        const utmParams = { utmCampaign: "comment_reply" };

        return getWebAppURL(pathname, searchParams, utmParams);
    }

    private getZeplinAppURI(event: ProjectNoteCommentCreatedEvent): string {
        const {
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
        } = event;
        const searchParams = {
            pid: projectId,
            sid: screenId,
            did: noteId,
            cmids: commentId
        };
        const utmParams = { utmCampaign: "comment_reply" };

        return getRedirectURLForZeplinApp("dot", searchParams, utmParams);
    }

    shouldHandleEvent(event: WebhookEvent): event is ProjectNoteCommentCreatedEvent {
        return event.action === "created";
    }

    getGroupingKey({ webhookId, deliveryId }: GroupingKeyParams<ProjectNoteCommentCreatedEvent>): string {
        return `${webhookId}:${deliveryId}`;
    }

    getTeamsMessage(events: ProjectNoteCommentCreatedEvent[]): MessageCard {
        const [event] = events;
        return commonTeamsCard({
            text: this.getText(event),
            section: {
                text: this.getSectionText(event)
            },
            links: [{
                title: "Open in App",
                url: this.getZeplinAppURI(event)
            }, {
                title: "Open in Web",
                url: this.getWebappURL(event)
            }]
        });
    }
}

export const projectNoteCommentHandler = new ProjectNoteCommentHandler();
