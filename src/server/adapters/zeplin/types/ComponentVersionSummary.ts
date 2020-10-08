import { User } from "./User";
import { Thumbnails } from "./Thumbnails";

enum DestinationType {
    SCREEN = "screen",
    PREVIOUS = "previous",
}

export interface ComponentVersionSummary {
    id: string;
    created: number;
    creator?: User;
    commit?: {
        color: {
            r: number;
            g: number;
            b: number;
            a: number;
        };
        message?: string;
        author?: User;
    };
    image_url?: string;
    thumbnails?: Thumbnails;
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
