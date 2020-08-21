import React, { FunctionComponent } from "react";
import { Dropdown } from "@fluentui/react-northstar";
import { Workspace } from "../../../../requester";

interface WorkspaceDropdownProps {
    disabled: boolean;
    loading: boolean;
    workspaces: Workspace[];
    onChange: (value: string) => void;
}

export const WorkspaceDropdown: FunctionComponent<WorkspaceDropdownProps> = ({
    disabled,
    loading,
    workspaces,
    onChange
}) => (
    <Dropdown
        disabled={disabled}
        loading={loading}
        fluid
        checkable
        items={workspaces.map(({ name, id }) => ({
            key: id,
            header: name,
            onClick: (): void => onChange(id)
        }))}
        placeholder="Select Workspace"
    />
);
