import React, { FunctionComponent, ReactElement } from "react";
import { Divider, Dropdown } from "@fluentui/react-northstar";
import { Resource, ResourceType } from "../../../../requester";

interface ResourceDropdownProps {
    disabled: boolean;
    onChange: (value: Resource | undefined) => void;
}

export const ResourceDropdown: FunctionComponent<ResourceDropdownProps> = ({
    disabled,
    onChange
}) => (
    <Dropdown
        disabled={disabled}
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
                    onChange({ type: ResourceType.PROJECT, id: "id1" });
                }
            },
            {
                header: "Project 2",
                onClick: (): void => {
                    onChange({ type: ResourceType.PROJECT, id: "id2" });
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
                    onChange({ type: ResourceType.STYLEGUIDE, id: "id1" });
                }
            },
            {
                header: "Styleguide 2",
                onClick: (): void => {
                    onChange({ type: ResourceType.STYLEGUIDE, id: "id2" });
                }
            }
        ]}
        placeholder="Select Project/Styleguide"
    />
);
