import { ProjectBoardCreatedEvent, WebhookEvent } from "@zeplin/sdk-berkay-board";

import { NotificationHandler } from "../NotificationHandler";
import { MessageCard, commonTeamsCard } from "../teamsCardTemplates";
import { MEDIUM_DELAY } from "../constants";
import { md } from "../md";
import { getRandomEmoji } from "../getRandomEmoji";
import { getRedirectURLForZeplinApp, getWebAppURL } from "../zeplinURL";

class ProjectBoardHandler extends NotificationHandler<ProjectBoardCreatedEvent> {
    delay = MEDIUM_DELAY;

    private getText(): string {
        return md`**Added 5+ nodes, 4+ connectors** to board ! ${getRandomEmoji()}`;
    }

    private getWebappURL(event: ProjectBoardCreatedEvent): string {
        const {
            context: {
                project: {
                    id: projectId
                }
            }
        } = event;

        return getWebAppURL(`project/${projectId}`);
    }

    private getZeplinAppURIURI(event: ProjectBoardCreatedEvent): string {
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

    getTeamsMessage(event: ProjectBoardCreatedEvent): MessageCard {
        return commonTeamsCard({
            text: this.getText(),
            links: [{
                title: "Open in App",
                url: this.getZeplinAppURIURI(event)
            }, {
                title: "Open in Web",
                url: this.getWebappURL(event)
            }]
        });
    }

    shouldHandleEvent(event: WebhookEvent): event is ProjectBoardCreatedEvent {
        return event.action === "created";
    }
}

export const projectBoardHandler = new ProjectBoardHandler();
