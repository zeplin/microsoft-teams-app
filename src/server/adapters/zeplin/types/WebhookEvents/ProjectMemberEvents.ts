import { WebhookEventType } from "./WebhookEventTypes";
import { ProjectContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { ProjectMember } from "../ProjectMember";
import { BaseWebhookEvent } from "./BaseWebhookEvent";

type BaseProjectMemberEvent<A extends string, R extends object | undefined> = BaseWebhookEvent<
    WebhookEventType.PROJECT_MEMBER,
    A,
    ProjectContext,
    WebhookEventResourceType.PROJECT_MEMBER,
    R
>;

export type ProjectMemberInviteEvent = BaseProjectMemberEvent<"invited", ProjectMember>;
export type ProjectMemberRoleUpdateEvent = BaseProjectMemberEvent<"role_updated", ProjectMember>;
export type ProjectMemberRemoveEvent = BaseProjectMemberEvent<"removed", undefined>;

export type ProjectMemberEvent = (
    ProjectMemberInviteEvent |
    ProjectMemberRoleUpdateEvent |
    ProjectMemberRemoveEvent
);
