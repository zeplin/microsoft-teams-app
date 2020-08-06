import { WebhookEvent } from "../../messageTypes";

type EventSourceType = "Project" | "Styleguide";
function getEventSourceType(eventType: string): EventSourceType {
    const [sourceTypeIdentifier] = eventType.split(".");
    if (sourceTypeIdentifier === "project") {
        return "Project";
    }

    if (sourceTypeIdentifier === "styleguide") {
        return "Styleguide";
    }

    // TODO: Another error?
    throw new Error(`Source type is not known for event type: ${eventType}`);
}

export abstract class NotificationHandler {
    abstract get delay(): number;
    abstract getTeamsMessage(events: WebhookEvent[]): string;
    getGroupingKey(event: WebhookEvent): string {
        const {
            event: eventType,
            action,
            context,
            actor: {
                user: {
                    id: userId
                }
            }
        } = event.payload;
        const sourceId = "project" in context ? context.project.id : context.styleguide.id;
        return `${event.webhookId}:${getEventSourceType(eventType)}:${sourceId}:${eventType}:${action}:${userId}`;
    }
}