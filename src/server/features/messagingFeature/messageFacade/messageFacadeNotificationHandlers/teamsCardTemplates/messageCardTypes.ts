export type Image = {
    image: string;
    title: string;
};

export type Section = {
    title?: string;
    text?: string;
    activityImage?: string;
    activityTitle?: string;
    activitySubtitle?: string;
    activityText?: string;
    heroImage?: string;
    images?: Image[];
};

export type PotentialAction = {
    "@type": "OpenUri";
    name: string;
    targets: {
        os: "default" | "iOS" | "android" | "windows";
        uri: string;
    }[];
};

export type MessageCard = {
    "@type": "MessageCard";
    "@context": "https://schema.org/extensions";
    title?: string;
    text?: string;
    summary?: string;
    sections: Section[];
    potentialAction?: PotentialAction[];
}