export interface SpacingToken {
    id: string;
    name: string;
    value: number;
    color: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    section: {
        id: string;
    };
}
