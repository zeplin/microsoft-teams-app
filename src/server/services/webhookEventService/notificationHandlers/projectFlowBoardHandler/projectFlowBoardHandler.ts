import { ProjectFlowBoardBuiltEvent, WebhookEvent } from "@zeplin/sdk";

import { GroupingKeyParams, NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { md } from "../md";
import { getRedirectURLForZeplinApp, getWebAppURL } from "../zeplinURL";

type Event = ProjectFlowBoardBuiltEvent;

class ProjectFlowBoardHandler extends NotificationHandler<Event> {
    delay = 0;

    private getText(event: Event): string {
        const {
            context: {
                project: {
                    name: projectName
                }
            },
            actor: {
                user: {
                    username
                }
            }
        } = event;
        return md`${username} built the first flow for ${projectName}. ⤴️`;
    }

    private getWebappURL(event: Event): string {
        const {
            context: {
                project: {
                    id: projectId
                }
            }
        } = event;

        return getWebAppURL(`project/${projectId}`);
    }

    private getZeplinAppURI(event: Event): string {
        const {
            context: {
                project: {
                    id: projectId
                }
            }
        } = event;

        const resource = "project";
        const searchParams = {
            pid: projectId
        };

        return getRedirectURLForZeplinApp(resource, searchParams);
    }

    getTeamsMessage(events: Event[]): MessageCard {
        const [event] = events;
        return commonTeamsCard({
            text: this.getText(event),
            links: [{
                title: "Open in App",
                url: this.getZeplinAppURI(event)
            }, {
                title: "Open in Web",
                url: this.getWebappURL(event)
            }],
            section: {
                text: "Flows in Zeplin provide a bird's-eye view of how screens in a project connect. [Learn more.](https://zpl.io/flows)"
            }
        });
    }

    shouldHandleEvent(event: WebhookEvent): event is ProjectFlowBoardBuiltEvent {
        return event.action === "built";
    }

    // A unique grouping key so that it won't be grouped with any other events
    getGroupingKey({ deliveryId, webhookId }: GroupingKeyParams<ProjectFlowBoardBuiltEvent>): string {
        return `${webhookId}:${deliveryId}`;
    }
}

export const projectFlowBoardHandler = new ProjectFlowBoardHandler();
