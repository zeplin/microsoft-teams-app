import { User } from "./User";
import { NoteComment } from "./NoteComment";
import { NoteStatus } from "./NoteStatus";

export interface Note {
    id: string;
    created: number;
    order: string;
    status: NoteStatus;
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
    comments: NoteComment[];
}
