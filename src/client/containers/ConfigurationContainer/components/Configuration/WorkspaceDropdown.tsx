import React, { FunctionComponent } from "react";
import { Dropdown } from "@fluentui/react-northstar";
import { Workspace } from "../../../../constants";

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
        loadingMessage="Loading..."
        checkable
        items={workspaces.map(({ name, id }) => ({
            key: id,
            header: name,
            onClick: (): void => onChange(id)
        }))}
        placeholder="Select Workspace"
    />
);
