import { AdaptiveCard, Container } from "../teamsCardTypes";

type CommonnTeamsCardParams = {
    title: string;
    text: string;
    sectionText: string;
    sectionTitle?: string;
    images?: string[];
    links?: {
        title: string;
        url: string;
    }[];
}

type SectionParams = {
    title?: string;
    text: string;
};

function section({ title, text }: SectionParams): Container {
    return {
        type: "Container",
        spacing: "extraLarge",
        items: [
            ...(title ? [{
                type: "TextBlock",
                text: title,
                spacing: "none",
                weight: "bolder"
            } as const] : []),
            {
                type: "TextBlock",
                text,
                spacing: "none"
            }
        ]
    };
}

export function commonTeamsCard({
    title,
    text,
    sectionText,
    sectionTitle,
    images = [],
    links = []
}: CommonnTeamsCardParams): AdaptiveCard {
    return {
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.2",
        body: [
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
            section({ title: sectionTitle, text: sectionText }),
            ...(images.length > 0 ? [{
                type: "ImageSet",
                spacing: "extraLarge",
                imageSize: "large",
                images: images.map(image => ({
                    type: "Image",
                    url: image,
                    size: "Large"
                } as const)),
                separator: false
            } as const] : []),
            ...(links.length > 0 ? [{
                type: "ActionSet",
                spacing: "extraLarge",
                actions: links.map(({ title: linkTitle, url }) => ({
                    type: "Action.OpenUrl",
                    title: linkTitle,
                    url
                } as const))
            } as const] : [])
        ]
    };
}