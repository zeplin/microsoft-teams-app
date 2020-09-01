import React, { FunctionComponent, ReactElement } from "react";
import { Divider, Dropdown } from "@fluentui/react-northstar";
import { Project, Resource, ResourceType, Styleguide } from "../../../../constants";

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
                key: "Project Header",
                header: "Projects",
                disabled: true,
                styles: {
                    "font-weight": "bolder"
                }
            },
            ...projects.map(({ id, name }) => ({
                key: id,
                header: name,
                onClick: (): void => {
                    onChange({ type: ResourceType.PROJECT, id, name });
                }
            })),
            projects.length > 0 && styleguides.length > 0 && {
                key: "Seperator",
                as: (): ReactElement => <Divider />,
                disabled: true
            },
            styleguides.length > 0 && {
                key: "Styleguide Header",
                header: "Styleguides",
                disabled: true,
                styles: {
                    "font-weight": "bolder"
                }
            },
            ...styleguides.map(({ id, name }) => ({
                key: id,
                header: name,
                onClick: (): void => {
                    onChange({ type: ResourceType.STYLEGUIDE, id, name });
                }
            }))
        ]}
        placeholder="Select Project/Styleguide"
    />
);
