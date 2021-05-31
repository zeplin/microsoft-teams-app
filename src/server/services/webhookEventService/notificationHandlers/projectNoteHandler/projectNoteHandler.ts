import { ProjectNoteCreatedEvent, WebhookEvent } from "@zeplin/sdk";

import { GroupingKeyParams, NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForZeplinApp, getWebAppURL } from "../zeplinURL";

class ProjectNoteHandler extends NotificationHandler<ProjectNoteCreatedEvent> {
    // We want to send project note events immediately
    delay = 0;

    private getText(event: ProjectNoteCreatedEvent): string {
        const {
            context: {
                project: {
                    name: projectName
                },
                screen: {
                    name: screenName,
                    variant: screenVariant
                }
            },
            actor: {
                user: {
                    username
                }
            }
        } = event;

        return (screenVariant)
            ? md`**${username as string}** added a note on _${screenVariant.value}_ variant of _${screenVariant.group.name}_ in _${projectName}_. ${getRandomEmoji()}`
            : md`**${username as string}** added a note on _${screenName}_ screen in _${projectName}_. ${getRandomEmoji()}`;
    }

    private getSectionText(event: ProjectNoteCreatedEvent): string {
        const {
            resource: {
                data: {
                    comments: [{ content: commentContent }]
                }
            }
        } = event;
        return commentContent;
    }

    private getWebappURL(event: ProjectNoteCreatedEvent): string {
        const {
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
        } = event;
        const pathname = `project/${projectId}/screen/${screenId}`;
        const searchParams = {
            did: noteId
        };

        return getWebAppURL(pathname, searchParams);
    }

    private getZeplinAppURI(event: ProjectNoteCreatedEvent): string {
        const {
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
        } = event;
        const searchParams = {
            pid: projectId,
            sid: screenId,
            did: noteId
        };

        return getRedirectURLForZeplinApp("dot", searchParams);
    }

    shouldHandleEvent(event: WebhookEvent): event is ProjectNoteCreatedEvent {
        return event.action === "created";
    }

    // A unique grouping key so that it won't be grouped with any other events
    getGroupingKey({ deliveryId, webhookId }: GroupingKeyParams<ProjectNoteCreatedEvent>): string {
        return `${webhookId}:${deliveryId}`;
    }

    getTeamsMessage(events: ProjectNoteCreatedEvent[]): MessageCard {
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

export const projectNoteHandler = new ProjectNoteHandler();
