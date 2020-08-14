import { ResourceType, User } from "../../../messagingTypes";

export type ScreenVersionSummaryResource = {
    id: string;
    type: ResourceType.SCREEN_VERSION;
    data: {
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
                type: "screen" | "previous";
            };
        }[];
    };
}