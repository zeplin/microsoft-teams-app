import { User } from "./User";

export interface NoteComment {
    id: string;
    content: string;
    author?: User;
    updated: number;
}
