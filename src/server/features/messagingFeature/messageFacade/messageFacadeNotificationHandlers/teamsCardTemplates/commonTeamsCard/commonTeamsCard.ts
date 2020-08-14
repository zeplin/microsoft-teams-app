import {
    AdaptiveCard,
    Container,
    CardElementType,
    TextSize,
    SpacingStyle,
    ImageSize,
    TextWeight,
    ActionType
} from "../teamsCardTypes";

type CommonTeamsCardParams = {
    title?: string;
    text: string;
    section?: SectionParams;
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

function sectionElement({ title, text }: SectionParams): Container {
    return {
        type: CardElementType.CONTAINER,
        spacing: SpacingStyle.EXTRA_LARGE,
        items: [
            ...(title ? [{
                type: CardElementType.TEXT_BLOCK,
                text: title,
                spacing: SpacingStyle.NONE,
                weight: TextWeight.BOLDER
            } as const] : []),
            {
                type: CardElementType.TEXT_BLOCK,
                text,
                spacing: SpacingStyle.NONE
            }
        ]
    };
}

export function commonTeamsCard({
    title,
    text,
    section,
    images = [],
    links = []
}: CommonTeamsCardParams): AdaptiveCard {
    return {
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        type: "AdaptiveCard",
        version: "1.2",
        body: [
            ...(title ? [{
                type: CardElementType.TEXT_BLOCK,
                text: title,
                size: TextSize.LARGE,
                weight: TextWeight.BOLDER
            } as const] : []),
            {
                type: CardElementType.TEXT_BLOCK,
                text,
                wrap: true,
                spacing: SpacingStyle.SMALL
            },
            ...(section ? [sectionElement(section)] : []),
            ...(images.length > 0 ? [{
                type: CardElementType.IMAGE_SET,
                spacing: SpacingStyle.EXTRA_LARGE,
                imageSize: ImageSize.LARGE,
                images: images.map(image => ({
                    type: CardElementType.IMAGE,
                    url: image
                } as const)),
                separator: false
            } as const] : []),
            ...(links.length > 0 ? [{
                type: CardElementType.ACTION_SET,
                spacing: SpacingStyle.EXTRA_LARGE,
                actions: links.map(({ title: linkTitle, url }) => ({
                    type: ActionType.OPEN_URL,
                    title: linkTitle,
                    url
                } as const))
            } as const] : [])
        ]
    };
}