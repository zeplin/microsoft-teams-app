export interface TextStyle {
    id: string;
    created: number;
    name: string;
    postscript_name: string;
    font_family: string;
    font_size: number;
    font_weight: number;
    font_style: string;
    font_stretch: number;
    line_height?: number;
    letter_spacing?: number;
    text_align?: string;
    color?: {
        name?: string;
        r: number;
        g: number;
        b: number;
        a: number;
    };
}
