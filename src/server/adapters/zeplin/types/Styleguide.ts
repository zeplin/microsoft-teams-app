import { OrganizationSummary } from "./Organization";
import { RemPreferences } from "./RemPreferences";

export enum StyleguideStatus {
    ACTIVE = "active",
    ARCHIVED = "archived",
    DELETED = "deleted",
}

export enum StyleguidePlatform {
    BASE = "base",
    ANDROID = "android",
    IOS = "ios",
    WEB = "web",
    MAC_OS = "macos",
}

export interface Styleguide {
    id: string;
    created: number;
    name: string;
    description?: string;
    thumbnail?: string;
    platform: StyleguidePlatform;
    status: StyleguideStatus;
    organization?: OrganizationSummary;
    updated?: number;
    rem_preferences?: RemPreferences;
    number_of_components: number;
    number_of_text_styles: number;
    number_of_colors: number;
    number_of_spacing_tokens: number;
    number_of_members: number;
    parent?: {
        id: string;
    };
}
