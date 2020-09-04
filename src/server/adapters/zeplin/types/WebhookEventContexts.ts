import { Project } from "./Project";
import { Styleguide } from "./Styleguide";
import { Screen } from "./Screen";
import { Note } from "./Note";

export interface ProjectContext {
    project: Project;
}

export interface ScreenContext {
    screen: Screen;
}

export interface NoteContext {
    note: Note;
}

export interface StyleguideContext {
    styleguide: Styleguide;
}
