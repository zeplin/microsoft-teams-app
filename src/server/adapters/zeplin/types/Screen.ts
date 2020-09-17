import { Thumbnails } from "./Thumbnails";

export interface Screen {
    id: string;
    created: number;
    updated?: number;
    tags: string[];
    name: string;
    image: {
        width: number;
        height: number;
        original_url?: string;
        thumbnails?: Thumbnails;
    };
    section?: {
        id: string;
    };
    description?: string;
    number_of_versions: number;
    number_of_notes: number;
}
