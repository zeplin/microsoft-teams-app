import { Project } from "../Project";
import { Styleguide } from "../Styleguide";
import { Screen } from "../Screen";
import { Note } from "../Note";
import { ComponentVersionSummary } from "../ComponentVersionSummary";
import { ScreenVersionSummary } from "../ScreenVersionSummary";

export interface ProjectContext {
    project: Project;
}

export interface ComponentVersionContext {
    version: ComponentVersionSummary;
}

export interface ScreenVersionContext {
    version: ScreenVersionSummary;
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
