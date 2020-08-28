import { MessageCard } from "../messageCardTypes";

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

export function commonTeamsCard({
    title,
    text,
    section,
    images = [],
    links = []
}: CommonTeamsCardParams): MessageCard {
    return {
        "@type": "MessageCard",
        "@context": "https://schema.org/extensions",
        title,
        text,
        "sections": [
            ...(section || images.length > 0 ? [{
                title: section?.title,
                text: section?.text,
                images: images.map(image => ({
                    image,
                    title: "Section Image"
                }))
            }] : [])
        ],
        ...(links.length > 0 ? {
            potentialAction: links.map(({ title: linkTitle, url }) => ({
                "@type": "OpenUri",
                "name": linkTitle,
                "targets": [{
                    os: "default",
                    uri: url
                }]
            }))
        } : null)
    };
}