import React, { FunctionComponent } from "react";
import { Dropdown } from "@fluentui/react-northstar";

import { Workspace, WorkspaceType } from "./types";

interface WorkspaceDropdownProps {
    loading: boolean;
    organizations: {
        name: string;
        id: string;
    }[];
    onChange: (value: Workspace | undefined) => void;
}

export const WorkspaceDropdown: FunctionComponent<WorkspaceDropdownProps> = ({
    loading,
    organizations,
    onChange
}) => <Dropdown
    loading={loading}
    fluid
    checkable
    items={[
        {
            header: "Personal Workspace",
            onClick: (): void => onChange({ type: WorkspaceType.PERSONAL })
        },
        ...organizations.map(({ name, id }) => ({
            header: `${name}'s Workspace`,
            onClick: (): void => onChange({ type: WorkspaceType.ORGANIZATION, organizationId: id })
        }))
    ]}
    placeholder="Select Workspace"
/>;
