import { AdaptiveCard, AdaptiveCardItem, Container } from "./teamsCardTypes";

function section({ title, text }: { title?: string; text: string }): Container {
    const items = [];
    if (title) {
        items.push({
            type: "TextBlock",
            text: title,
            spacing: "none",
            weight: "bolder"
        });
    }

    items.push({
        type: "TextBlock",
        text,
        spacing: "none"
    });

    return {
        type: "Container",
        spacing: "large",
        items
    };
}

export function commonTeamsCard({
    title,
    text,
    sectionTitle,
    sectionText,
    images = [],
    links = []
}: {
    title: string;
    text: string;
    sectionTitle?: string;
    sectionText: string;
    images?: string[];
    links?: {
        title: string;
        url: string;
    }[];
}): AdaptiveCard {
    const body: AdaptiveCardItem[] = [
        {
            type: "TextBlock",
            text: title,
            size: "large",
            weight: "bolder"
        },
        {
            type: "TextBlock",
            text,
            wrap: true,
            spacing: "small"
        },
        section({ title: sectionTitle, text: sectionText })
    ];

    if (images.length > 0) {
        body.push({
            type: "ImageSet",
            spacing: "large",
            imageSize: "large",
            images: images.map(image => ({
                type: "Image",
                url: image,
                size: "Large"
            })),
            separator: false
        });
    }

    body.push({
        type: "ActionSet",
        spacing: "large",
        actions: links.map(({ title: linkTitle, url }) => ({
            type: "Action.OpenUrl",
            title: linkTitle,
            url
        }))
    });

    return {
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.2",
        body
    };
}