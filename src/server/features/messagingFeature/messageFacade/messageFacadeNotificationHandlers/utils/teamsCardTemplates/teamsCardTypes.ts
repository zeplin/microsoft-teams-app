// See: https://adaptivecards.io/schemas/adaptive-card.json
type AdaptiveCardItem = TextBlock | Container;
type SpacingStyle = "none" | "small" | "default" | "medium" | "large" | "extraLarge" | "padding";
type ActionOpenUrl = {
    type: "Action.OpenUrl";
    url: string;
    title?: string;
    iconUrl?: string;
}

type Action = ActionOpenUrl;

type TextBlock = {
    type: "TextBlock";
    text: string;
    wrap?: boolean;
    weight?: "ligher" | "default" | "bolder";
    size?: "small" | "default" | "medium" | "large" | "extraLarge";
    spacing?: SpacingStyle;
}

type Container = {
    type: "Container";
    spacing: SpacingStyle;
    items: AdaptiveCardItem[];
}

export type AdaptiveCard = {
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json";
    type: "AdaptiveCard";
    version: "1.2";
    body: AdaptiveCardItem[];
    actions: Action[];
}