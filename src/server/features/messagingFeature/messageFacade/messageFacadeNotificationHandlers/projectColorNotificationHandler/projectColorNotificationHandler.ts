import {
    ResourceType,
    WebhookEvent,
    EventPayload,
    ProjectContext,
    EventType
} from "../../../messageTypes";
import { NotificationHandler } from "../NotificationHandler";
import { SHORT_DELAY } from "../constants";

type ProjectColorEventDescriptor = {
    type: EventType.PROJECT_COLOR;
    action: "created" | "updated";
};

type ProjectColorDeletedEventDescriptor = {
    type: EventType.PROJECT_COLOR;
    action: "deleted";
}

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

function isDeletedEvents(
    events:
        | WebhookEvent<ProjectColorEventPayload>[]
        | WebhookEvent<ProjectColorDeletedEventPayload>[]
): events is WebhookEvent<ProjectColorDeletedEventPayload>[] {
    return events[0].payload.action === "deleted";
}

class ProjectColorNotificationHandler extends NotificationHandler {
    delay = SHORT_DELAY;
    private getDeleteMessage(
        events: WebhookEvent<ProjectColorDeletedEventPayload>[]
    ): string {
        if (events.length === 1) {
            return `A color is deleted from project ${events[0].payload.context.project.id}`;
        }

        return events.map(event => event.deliveryId).join(" ");
    }

    private getCreateMessage(
        events: WebhookEvent<ProjectColorEventPayload>[]
    ): string {
        if (events.length === 1) {
            return `Color ${events[0].payload.resource.id} is added to project ${events[0].payload.context.project.id}`;
        }

        return events.map(event => event.deliveryId).join(" ");
    }

    private getUpdateMessage(
        events: WebhookEvent<ProjectColorEventPayload>[]
    ): string {
        if (events.length === 1) {
            return `Color ${events[0].payload.resource.id} is updated in project ${events[0].payload.context.project.id}`;
        }

        return events.map(event => event.deliveryId).join(" ");
    }

    getTeamsMessage(
        events: WebhookEvent<ProjectColorEventPayload>[] | WebhookEvent<ProjectColorDeletedEventPayload>[]
    ): string {
        if (isDeletedEvents(events)) {
            return this.getDeleteMessage(events);
        }

        if (events[0].payload.action === "created") {
            return this.getCreateMessage(events);
        }

        return this.getUpdateMessage(events);
    }
}

export type ProjectColorDeletedEventPayload = EventPayload<
    ProjectColorDeletedEventDescriptor,
    ProjectContext,
    { id: string; type: ResourceType.COLOR }
>;
export type ProjectColorEventPayload = EventPayload<
    ProjectColorEventDescriptor,
    ProjectContext,
    ProjectColorResource
>;
export const projectColorNotificationHandler = new ProjectColorNotificationHandler();