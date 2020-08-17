import React, { FunctionComponent, ReactElement, useState } from "react";
import {
    Divider,
    Dropdown,
    Flex,
    Text
} from "@fluentui/react-northstar";
import Axios from "axios";
import { useQuery } from "react-query";

import { ConfigurationCheckbox } from "./ConfigurationCheckbox";
import { BASE_URL } from "../../../config";
import { useRouter } from "next/router";

type Workspace = {
    type: "Personal";
} | {
    type: "Organization";
    organizationId: string;
}
interface Resource {
    type: "Project" | "Styleguide";
    id: string;
}

interface ConfigurationProps {
    accessToken: string;
}

export const Configuration: FunctionComponent<ConfigurationProps> = ({
    accessToken
}) => {
    const {
        query: {
            channel
        }
    } = useRouter();

    const { isLoading: isOrganizationsLoading, data: organizations } = useQuery(
        "organizations",
        async () => {
            const { data: result } = await Axios.get(
                `${BASE_URL}/api/organizations`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            return result;
        },
        {
            initialData: []
        }
    );

    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>();
    const [selectedResource, setSelectedResource] = useState<Resource | undefined>();

    const shouldShowProjectSpecificCheckboxes = !selectedResource || selectedResource.type === "Project";

    return (
        <Flex fill column gap="gap.large">
            <div />
            <Flex fill column gap="gap.small">
                <Text weight="semibold">
                    You are connecting <Text weight="bold">#{channel}</Text> to Zeplin.
                </Text>
                <Text>
                    Can{"'"}t find the project/styleguide to connect to?
                    {" "}
                    <Text
                        as="a"
                        color="brand"
                        href="https://zpl.io/msteams-app-docs"
                        target="_blank"
                        styles={{
                            "textDecoration": "none",
                            ":hover": {
                                textDecoration: "underline"
                            }
                        }}>
                        Learn more about permissions.
                    </Text>
                </Text>
                <Flex fill gap="gap.small">
                    <Flex.Item grow shrink={0} styles={{ flexBasis: 0 }}>
                        <Dropdown
                            loading={isOrganizationsLoading}
                            fluid
                            checkable
                            items={[
                                {
                                    header: "Personal Workspace",
                                    onClick: (): void => {
                                        setSelectedWorkspace({ type: "Personal" });
                                        setSelectedResource(undefined);
                                    }
                                },
                                ...organizations.map(({ name, id }) => ({
                                    header: `${name}'s Workspace`,
                                    onClick: (): void => {
                                        setSelectedWorkspace({ type: "Organization", organizationId: id });
                                        setSelectedResource(undefined);
                                    }
                                }))
                            ]}
                            placeholder="Select Workspace"
                        />
                    </Flex.Item>
                    <Flex.Item grow shrink={0} styles={{ flexBasis: 0 }}>
                        <Dropdown
                            disabled={!selectedWorkspace}
                            fluid
                            checkable
                            items={ [
                                {
                                    header: "Projects",
                                    disabled: true,
                                    styles: {
                                        "font-weight": "bolder"
                                    }
                                },
                                {
                                    header: "Project 1",
                                    onClick: (): void => {
                                        setSelectedResource({ type: "Project", id: "id1" });
                                    }
                                },
                                {
                                    header: "Project 2",
                                    onClick: (): void => {
                                        setSelectedResource({ type: "Project", id: "id2" });
                                    }
                                },
                                {
                                    as: (): ReactElement => <Divider />,
                                    disabled: true
                                },
                                {
                                    header: "Styleguides",
                                    disabled: true,
                                    styles: {
                                        "font-weight": "bolder"
                                    }
                                },
                                {
                                    header: "Styleguide 1",
                                    onClick: (): void => {
                                        setSelectedResource({ type: "Project", id: "id1" });
                                    }
                                },
                                {
                                    header: "Styleguide 2",
                                    onClick: (): void => {
                                        setSelectedResource({ type: "Project", id: "id2" });
                                    }
                                }
                            ]}
                            placeholder="Select Project/Styleguide"
                        />
                    </Flex.Item>
                </Flex>
            </Flex>
            <Flex fill column gap="gap.medium">
                <Text weight="semibold">
                    Select the events you want to get a message for:
                </Text>
                <Flex fill gap="gap.small">
                    <Flex fill column gap="gap.smaller">
                        {
                            shouldShowProjectSpecificCheckboxes
                                ? (
                                    <>

                                        <ConfigurationCheckbox title="Screens" description="Screens added" />
                                        <ConfigurationCheckbox title="Screen versions" description="Versions added to screen" />
                                    </>
                                )
                                : null
                        }
                        <ConfigurationCheckbox title="Components" description="Components added, removed or updated on Styleguide" />
                        <ConfigurationCheckbox title="Colors" description="Colors added, removed or updated on Styleguide" />
                        <ConfigurationCheckbox title="Text styles" description="Text styles added, removed or updated on Styleguide" />
                    </Flex>
                    <Flex fill column gap="gap.smaller">
                        <ConfigurationCheckbox title="Spacing tokens" description="Text styles added, removed or updated on Styleguide" />
                        {
                            shouldShowProjectSpecificCheckboxes
                                ? (
                                    <>
                                        <ConfigurationCheckbox title="Notes" description="Note added" />
                                        <ConfigurationCheckbox title="Replies" description="Replied to note" />
                                    </>
                                )
                                : null
                        }
                        <ConfigurationCheckbox title="Members" description="Members invited" />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};
