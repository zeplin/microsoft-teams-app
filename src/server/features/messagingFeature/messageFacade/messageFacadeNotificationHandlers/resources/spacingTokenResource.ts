import { ResourceType } from "../../../messagingTypes";

export type SpacingTokenResource = {
    id: string;
    type: ResourceType.SPACING_TOKEN;
    data: {
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
    };
}