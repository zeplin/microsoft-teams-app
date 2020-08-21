import { OrganizationSummary } from "./Organization";
import { RemPreferences } from "./RemPreferences";

export enum ProjectStatus {
    ACTIVE = "active",
    ARCHIVED = "archived",
    DELETED = "deleted",
}

export enum ProjectPlatform {
    ANDROID = "android",
    IOS = "ios",
    WEB = "web",
    MAC_OS = "macos",
}

export interface Project {
    id: string;
    created: number;
    name: string;
    description?: string;
    thumbnail?: string;
    platform: ProjectPlatform;
    status: ProjectStatus;
    organization?: OrganizationSummary;
    scene_url?: string;
    updated?: number;
    rem_preferences?: RemPreferences;
    number_of_screens: number;
    number_of_components: number;
    number_of_text_styles: number;
    number_of_colors: number;
    number_of_spacing_tokens: number;
    number_of_members: number;
    linked_styleguide?: {
        id: string;
    };
}
