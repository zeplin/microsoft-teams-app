import React, { FunctionComponent, ReactElement } from "react";
import { Divider, Dropdown } from "@fluentui/react-northstar";
import { Project, Resource, ResourceType, Styleguide } from "../../../../requester";

interface ResourceDropdownProps {
    disabled: boolean;
    loading: boolean;
    projects: Project[];
    styleguides: Styleguide[];
    onChange: (value: Resource | undefined) => void;
}

export const ResourceDropdown: FunctionComponent<ResourceDropdownProps> = ({
    disabled,
    loading,
    projects,
    styleguides,
    onChange
}) => (
    <Dropdown
        disabled={disabled}
        loading={loading}
        loadingMessage="Loading..."
        fluid
        checkable
        items={ [
            projects.length > 0 && {
                header: "Projects",
                disabled: true,
                styles: {
                    "font-weight": "bolder"
                }
            },
            ...projects.map(({ id, name }) => ({
                header: name,
                onClick: (): void => {
                    onChange({ type: ResourceType.PROJECT, id });
                }
            })),
            projects.length > 0 && styleguides.length > 0 && {
                header: "Seperator",
                as: (): ReactElement => <Divider />,
                disabled: true
            },
            styleguides.length > 0 && {
                header: "Styleguides",
                disabled: true,
                styles: {
                    "font-weight": "bolder"
                }
            },
            ...styleguides.map(({ id, name }) => ({
                header: name,
                onClick: (): void => {
                    onChange({ type: ResourceType.STYLEGUIDE, id });
                }
            }))
        ]}
        placeholder="Select Project/Styleguide"
    />
);
