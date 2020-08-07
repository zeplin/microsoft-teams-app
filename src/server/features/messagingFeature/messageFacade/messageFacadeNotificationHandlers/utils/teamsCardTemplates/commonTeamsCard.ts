import { AdaptiveCard } from "./teamsCardTypes";

export function commonTeamsCard({
    title,
    text,
    subText,
    links = []
}: {
    title: string;
    text: string;
    subText: string;
    links?: {
        title: string;
        url: string;
    }[];
}): AdaptiveCard {
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
            {
                type: "Container",
                spacing: "large",
                items: [
                    {
                        type: "TextBlock",
                        text: subText,
                        spacing: "none"
                    }
                ]
            }
        ],
        actions: links.map(({ title: linkTitle, url }) => ({
            type: "Action.OpenUrl",
            title: linkTitle,
            url
        }))
    };
}