import React, { FunctionComponent, useState } from "react";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";
import * as microsoftTeams from "@microsoft/teams-js";

import { Resource, ResourceType, WebhookEventType } from "../../constants";
import {
    useResources,
    useValidate,
    useWorkspaces,
    useConfigurationCreate
} from "./hooks";
import { storage, url } from "../../lib";
import { useMe, useInitialize } from "../../hooks";
import { ConfigurationCreate } from "./components";

const DEFAULT_ERROR_MESSAGE = "Could not proceed due to a connectivity issue, please try again or let us know: support@zeplin.io.";

type State = {
    workspaceId?: string;
    resourceSearch: string;
    resource?: Resource;
    events: WebhookEventType[];
    configurationCreateError?: string;
};

export const ConfigurationCreateContainer: FunctionComponent = () => {
    const { query: { channel, theme }, replace } = useRouter();

    const { isInitializeLoading } = useInitialize();

    const [
        {
            resource,
            resourceSearch,
            events,
            workspaceId,
            configurationCreateError
        },
        setState
    ] = useState<State>({
        resourceSearch: "",
        events: Object.values(WebhookEventType)
    });

    const {
        areWorkspacesLoading,
        workspacesError,
        workspaces,
        refetchWorkspaces
    } = useWorkspaces({
        onError: isAuthorizationError => {
            if (isAuthorizationError) {
                replace(url.getLoginUrl({
                    channel: channel as string,
                    theme: theme as string
                }));
            }
        }
    });

    const {
        me
    } = useMe({
        onError: isAuthorizationError => {
            if (isAuthorizationError) {
                replace(url.getLoginUrl({
                    channel: channel as string,
                    theme: theme as string
                }));
            }
        }
    });

    const {
        areResourcesLoading,
        projectsError,
        styleguidesError,
        projects,
        styleguides,
        refetchProjects,
        refetchStyleguides
    } = useResources({
        workspaceId,
        onProjectsSuccess: newProjects => {
            if (
                resource?.type === ResourceType.PROJECT &&
                newProjects.findIndex(({ id }) => id === resource?.id) === -1
            ) {
                setState(prevState => ({
                    ...prevState,
                    resourceSearch: "",
                    resource: undefined
                }));
            }
        },
        onStyleguidesSuccess: newStyleguides => {
            if (
                resource?.type === ResourceType.STYLEGUIDE &&
                newStyleguides.findIndex(({ id }) => id === resource?.id) === -1
            ) {
                setState(prevState => ({
                    ...prevState,
                    resourceSearch: "",
                    resource: undefined
                }));
            }
        },
        onError: isAuthorizationError => {
            if (isAuthorizationError) {
                replace(url.getLoginUrl({
                    channel: channel as string,
                    theme: theme as string
                }));
            }
        }

    });

    useValidate({
        enabled: !isInitializeLoading,
        workspaceId,
        resource,
        events
    });

    useConfigurationCreate({
        isInitialized: !isInitializeLoading,
        resource,
        events,
        workspaceId,
        onError: errorMessage => {
            setState(prevState => ({
                ...prevState,
                configurationCreateError: errorMessage
            }));
        }
    });

    if (isInitializeLoading) {
        return <Loader styles={{ height: "100vh" }} />;
    }
    microsoftTeams.settings.getSettings(settings => {
        console.log("Get Settings", JSON.stringify(settings, null, 4));
    });

    return (
        <ConfigurationCreate
            channelName={String(channel)}
            areWorkspacesLoading={areWorkspacesLoading}
            workspaces={workspaces || []}
            isWorkspaceSelected={Boolean(workspaceId)}
            resourceType={resource?.type ?? ResourceType.PROJECT}
            areResourcesLoading={areResourcesLoading}
            projects={projects || []}
            styleguides={styleguides || []}
            selectedWebhookEvents={events}
            hideRetry={configurationCreateError !== undefined}
            disabled={styleguidesError || projectsError || workspacesError}
            errorMessage={
                styleguidesError || projectsError || workspacesError
                    ? DEFAULT_ERROR_MESSAGE
                    : configurationCreateError
            }
            resourceSearch={resourceSearch}
            username={me?.username}
            onResourceSearch={(nextResourceSearch): void => {
                setState(prevState => ({
                    ...prevState,
                    resourceSearch: nextResourceSearch,
                    error: undefined
                }));
            }}
            onRetryClick={(): void => {
                if (workspacesError) {
                    refetchWorkspaces();
                }
                if (projectsError) {
                    refetchProjects();
                }
                if (styleguidesError) {
                    refetchStyleguides();
                }
            }}
            onResourceDropdownBlur={(): void => setState(prevState => ({
                ...prevState,
                configurationCreateError: undefined,
                resourceSearch: prevState.resource?.name ?? ""
            }))}
            onResourceDropdownFocus={(): void => setState(prevState => ({
                ...prevState,
                configurationCreateError: undefined,
                resourceSearch: ""
            }))}
            onWorkspaceChange={(nextWorkspaceId): void => setState(prevState => ({
                ...prevState,
                workspaceId: nextWorkspaceId,
                configurationCreateError: undefined,
                resourceSearch: "",
                resource: undefined
            }))}
            onResourceChange={(nextResource): void => setState(prevState => ({
                ...prevState,
                resource: nextResource,
                configurationCreateError: undefined,
                resourceSearch: nextResource.name
            }))}
            onWebhookEventsChange={(nextEvents): void => setState(prevState => ({
                ...prevState,
                configurationCreateError: undefined,
                events: nextEvents
            }))}
            onLogoutClick={(): void => {
                storage.removeRefreshToken();
                storage.removeAccessToken();
                replace(url.getLoginUrl({
                    channel: channel as string,
                    theme: theme as string
                }));
            }}
        />
    );
};
