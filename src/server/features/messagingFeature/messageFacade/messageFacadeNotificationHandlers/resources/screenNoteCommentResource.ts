import { User, ResourceType } from "../../../messagingTypes";

export type ScreenNoteCommentResource = {
    id: string;
    type: ResourceType.SCREEN_NOTE_COMMENT;
    data: {
        id: string;
        content: string;
        author?: User;
        updated: number;
    };
}