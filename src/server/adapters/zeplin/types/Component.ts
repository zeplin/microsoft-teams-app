import { Thumbnails } from "./Thumbnails";

export interface Component {
    id: string;
    name: string;
    created: number;
    updated?: number;
    description?: string;
    image?: {
        width: number;
        height: number;
        original_url?: string;
        thumbnails?: Thumbnails;
    };
    section?: {
        id: string;
        group?: {
            id: string;
        };
    };
}
