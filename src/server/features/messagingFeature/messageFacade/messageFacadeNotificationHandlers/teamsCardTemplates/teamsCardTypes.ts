// See: https://adaptivecards.io/schemas/adaptive-card.json
type ActionOpenUrl = {
    type: ActionType.OPEN_URL;
    url: string;
    title?: string;
    iconUrl?: string;
}

type Action = ActionOpenUrl;

type TextBlock = {
    type: CardElementType.TEXT_BLOCK;
    text: string;
    wrap?: boolean;
    weight?: TextWeight;
    size?: TextSize;
    spacing?: SpacingStyle;
}

export enum SpacingStyle {
    NONE = "none",
    SMALL = "small",
    DEFAULT = "default",
    MEDIUM = "medium",
    LARGE = "large",
    EXTRA_LARGE = "extraLarge",
    PADDING = "padding"
}

export enum ActionType {
    OPEN_URL = "Action.OpenUrl"
}

export enum CardElementType {
    TEXT_BLOCK = "TextBlock",
    ACTION_SET = "ActionSet",
    CONTAINER = "Container",
    IMAGE_SET = "ImageSet",
    IMAGE = "Image"
}

export enum ImageSize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}

export enum TextWeight {
    LIGHTER = "lighter",
    DEFAULT = "default",
    BOLDER = "bolder"
}

export enum TextSize {
    SMALL = "small",
    DEFAULT = "default",
    MEDIUM = "medium",
    LARGE = "large",
    EXTRA_LARGE = "extraLarge"
}

export type AdaptiveCardItem = TextBlock | ImageSet | ActionSet | Container;

export type ActionSet = {
    type: CardElementType.ACTION_SET;
    spacing?: SpacingStyle;
    actions: Action[];
}

export type Container = {
    type: CardElementType.CONTAINER;
    spacing?: SpacingStyle;
    items: AdaptiveCardItem[];
}

export type ImageSet = {
    type: CardElementType.IMAGE_SET;
    spacing: SpacingStyle;
    imageSize: ImageSize;
    images: {
        type: CardElementType.IMAGE;
        url: string;
    }[];
    separator?: boolean;
}

export type AdaptiveCard = {
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json";
    type: "AdaptiveCard";
    version: "1.2";
    body: AdaptiveCardItem[];
    actions?: Action[];
}