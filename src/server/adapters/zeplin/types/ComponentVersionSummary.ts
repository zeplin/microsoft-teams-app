import { User } from "./User";

enum DestinationType {
    SCREEN = "screen",
    PREVIOUS = "previous",
}

export interface ComponentVersionSummary {
    id: string;
    created: number;
    creator?: User;
    image_url?: string;
    background_color?: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    source: string;
    width: number;
    height: number;
    density_scale: number;
    links: {
        rect: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        destination: {
            name?: string;
            type: DestinationType;
        };
    }[];
}