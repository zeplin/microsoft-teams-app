import { ResourceType, WebhookEvent, EventPayload, ProjectContext } from "../../../messageTypes";
import { NotificationHandler } from "../NotificationHandler";

type ProjectColorEventDescriptor = {
    type: "project.color";
    action: "created" | "updated";
};

type ProjectColorResource = {
    id: string;
    type: ResourceType.COLOR;
    data: {
        id: string;
        created: number;
        name: string;
        r: number;
        g: number;
        b: number;
        a: number;
    };
};

class ProjectColorNotificationHandler extends NotificationHandler {
    delay: 1000; // eslint-disable-line
    getTeamsMessage(events: WebhookEvent<ProjectColorEventPayload>[]): string {
        if (events.length === 1) {
            const [event] = events;
            return `Color named ${event.payload.resource.data.name} updated for project ${event.payload.context.project.id}`;
        }

        return events.map(event => event.deliveryId).join(" ");
    }
}

export type ProjectColorEventPayload = EventPayload<
    ProjectColorEventDescriptor,
    ProjectContext,
    ProjectColorResource
>;
export const projectColorNotificationHandler = new ProjectColorNotificationHandler();