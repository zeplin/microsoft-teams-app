export type RemPreferences = {
    status: "enabled" ;
    root_font_size: number;
    use_for_font_sizes: boolean;
    use_for_measurements: boolean;
} | { status: "disabled" | "linked" }