import React, { FunctionComponent } from "react";
import { Dropdown } from "@fluentui/react-northstar";
import { Workspace } from "../../../../requester";

interface WorkspaceDropdownProps {
    loading: boolean;
    workspaces: Workspace[];
    onChange: (value: string) => void;
}

export const WorkspaceDropdown: FunctionComponent<WorkspaceDropdownProps> = ({
    loading,
    workspaces,
    onChange
}) => (
    <Dropdown
        loading={loading}
        fluid
        checkable
        items={workspaces.map(({ name, id }) => ({
            header: name,
            onClick: (): void => onChange(id)
        }))}
        placeholder="Select Workspace"
    />
);
