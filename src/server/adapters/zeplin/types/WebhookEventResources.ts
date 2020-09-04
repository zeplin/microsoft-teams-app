import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { Color } from "./Color";
import { Component } from "./Component";
import { ProjectMember } from "./ProjectMember";
import { NoteComment } from "./NoteComment";
import { Note } from "./Note";
import { Screen } from "./Screen";
import { ScreenVersionSummary } from "./ScreenVersionSummary";
import { StyleguideMember } from "./StyleguideMember";
import { TextStyle } from "./TextStyle";
import { SpacingToken } from "./SpacingToken";

interface BaseWebhookEventResource<
    T extends WebhookEventResourceType = WebhookEventResourceType,
    R extends object = object
> {
    id: string;
    type: T;
    data?: R;
}

export type WebhookEventResource = BaseWebhookEventResource;

export type TextStyleResource = BaseWebhookEventResource<WebhookEventResourceType.TEXT_STYLE, TextStyle>;
export type ColorResource = BaseWebhookEventResource<WebhookEventResourceType.COLOR, Color>;
export type ComponentResource = BaseWebhookEventResource<WebhookEventResourceType.COMPONENT, Component>;
export type ProjectMemberResource = BaseWebhookEventResource<WebhookEventResourceType.PROJECT_MEMBER, ProjectMember>;
export type ScreenResource = BaseWebhookEventResource<WebhookEventResourceType.SCREEN, Screen>;
export type NoteResource = BaseWebhookEventResource<WebhookEventResourceType.SCREEN_NOTE, Note>;
export type NoteCommentResource = BaseWebhookEventResource<
    WebhookEventResourceType.SCREEN_NOTE_COMMENT,
    NoteComment
>;
export type ScreenVersionResource = BaseWebhookEventResource<
    WebhookEventResourceType.SCREEN_VERSION,
    ScreenVersionSummary
>;
export type SpacingTokenResource = BaseWebhookEventResource<
    WebhookEventResourceType.SPACING_TOKEN,
    SpacingToken
>;
export type StyleguideMemberResource = BaseWebhookEventResource<
    WebhookEventResourceType.STYLEGUIDE_MEMBER,
    StyleguideMember
>;
