import { ResourceType, User } from "../../../messagingTypes";
import { ScreenNoteCommentResource } from "./screenNoteCommentResource";

export type ScreenNoteResource = {
    id: string;
    type: ResourceType.SCREEN_NOTE;
    data: {
        id: string;
        created: number;
        order: string;
        status: "open" | "resolved";
        position: {
            x: number;
            y: number;
        };
        creator?: User;
        color: {
            name: string;
            r: number;
            g: number;
            b: number;
            a: number;
        };
        comments: ScreenNoteCommentResource["data"][];
    };
}