import { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

import { Resource, resourceBasedEvents, WebhookEventType } from "../../../constants";

interface UseValidateParams {
    enabled: boolean;
    workspaceId?: string;
    resource?: Resource;
    events: WebhookEventType[];
}

function isValid({ workspaceId, resource, events }: UseValidateParams): boolean {
    return (
        workspaceId !== undefined &&
        resource !== undefined &&
        events.filter(
            event => resourceBasedEvents[resource.type].includes(event)
        ).length > 0
    );
}

export const useValidate = (params: UseValidateParams): void => {
    const valid = isValid(params);
    useEffect(() => {
        if (params.enabled) {
            microsoftTeams.pages.config.setValidityState(valid);
        }
    }, [valid, params.enabled]);
};
