import { WebhookEventType } from "./WebhookEventTypes";
import { StyleguideContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { StyleguideMember } from "../StyleguideMember";
import { BaseWebhookEvent } from "./BaseWebhookEvent";

type BaseStyleguideMemberEvent<A extends string, R extends object | undefined> = BaseWebhookEvent<
    WebhookEventType.STYLEGUIDE_MEMBER,
    A,
    StyleguideContext,
    WebhookEventResourceType.STYLEGUIDE_MEMBER,
    R
>;

export type StyleguideMemberInviteEvent = BaseStyleguideMemberEvent<"invited", StyleguideMember>;
export type StyleguideMemberRoleUpdateEvent = BaseStyleguideMemberEvent<"role_updated", StyleguideMember>;
export type StyleguideMemberRemoveEvent = BaseStyleguideMemberEvent<"removed", undefined>;

export type StyleguideMemberEvent = (
    StyleguideMemberInviteEvent |
    StyleguideMemberRoleUpdateEvent |
    StyleguideMemberRemoveEvent
);
