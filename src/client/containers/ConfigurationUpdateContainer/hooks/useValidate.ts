import { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { Resource, resourceBasedEvents, WebhookEventType } from "../../../constants";

interface UseValidateParams {
    enabled: boolean;
    events: WebhookEventType[];
    initialEvents?: WebhookEventType[];
    resource?: Resource;
}

function areDifferent<T>(left: T[], right: T[]): boolean {
    return left.length !== right.length || left.some(value => !right.includes(value));
}

function isValid({ resource, initialEvents, events }: UseValidateParams): boolean {
    if (!initialEvents || !resource) {
        return false;
    }
    const filteredEvents = events.filter(
        event => resourceBasedEvents[resource.type].includes(event)
    );
    const filteredInitialEvents = initialEvents.filter(
        event => resourceBasedEvents[resource.type].includes(event)
    );
    return filteredEvents.length > 0 && areDifferent(filteredInitialEvents, filteredEvents);
}

export const useValidate = (params: UseValidateParams): void => {
    const valid = isValid(params);
    useEffect(() => {
        if (params.enabled) {
            microsoftTeams.pages.config.setValidityState(valid);
        }
    }, [valid, params.enabled]);
};
