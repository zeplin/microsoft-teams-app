import { INTERNAL_SERVER_ERROR } from "http-status-codes";

import { ClientError } from "../../../ClientError";

const defaultUserFriendlyText = "We're experiencing an issue here. Please try it later or let us know: support@zeplin.io.";

export const errorToText = (error: Error): string => {
    if (!(error instanceof ClientError) || error.status >= INTERNAL_SERVER_ERROR) {
        return defaultUserFriendlyText;
    }

    switch (error.message) {
        case "User is not a member of the project":
            return "Only project members can update integrations settings.";
        case "User is not a member of the styleguide":
            return "Only styleguide members can update integrations settings.";
        case "Webhook not found":
            return "This integration has been removed in Zeplin. You can remove this connector and create it again.";
        case "Project not found":
        case "Project is archived":
            return "Project is not available anymore. You can remove this integration.";
        case "Styleguide not found":
        case "Styleguide is archived":
            return "Styleguide is not available anymore. You can remove this integration.";
        case "Only organization editor (or higher) can access project webhooks":
        case "Only organization editor (or higher) can access styleguide webhooks":
            return "Only organization editor (or higher) can update integration settings.";
        case "Only owner of the project can access webhooks":
            return "Only owner of the project update integration settings.";
        case "Only owner of the styleguide can access webhooks":
            return "Only owner of the styleguide update integration settings.";
        case "Cannot create a webhook with active status because provided URL is unhealthy":
        case "Cannot update webhook's URL because an active webhook's URL cannot be unhealthy":
        default:
            return defaultUserFriendlyText;
    }
};
