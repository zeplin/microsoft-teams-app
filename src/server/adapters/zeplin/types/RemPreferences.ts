export enum RemPreferencesStatus {
    ENABLED = "enabled",
    DISABLED = "disabled",
    LINKED = "linked"
}

export type RemPreferences = {
    status: RemPreferencesStatus.ENABLED ;
    root_font_size: number;
    use_for_font_sizes: boolean;
    use_for_measurements: boolean;
} | {
    status: RemPreferencesStatus.DISABLED | RemPreferencesStatus.LINKED;
}
