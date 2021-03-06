import React, { FunctionComponent, ReactElement, useState } from "react";
import { Divider, Dropdown, DropdownItemProps, ShorthandCollection } from "@fluentui/react-northstar";

import { Project, Resource, ResourceType, Styleguide } from "../../../constants";

interface ItemsGetParams {
    projects: Project[];
    styleguides: Styleguide[];
    loading: boolean;
}
const getItems = ({ projects, styleguides, loading }: ItemsGetParams): ShorthandCollection<DropdownItemProps> => {
    if (loading) {
        return [];
    }
    const result = [];
    if (projects.length > 0) {
        result.push(
            {
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
                resource: {
                    id,
                    name,
                    type: ResourceType.PROJECT
                }
            }))
        );
    }
    if (projects.length > 0 && styleguides.length > 0) {
        result.push({
            key: "Seperator",
            as: (props: DropdownItemProps): ReactElement => (
                <li {...props}>
                    <Divider styles={{ flex: 1 }}/>
                </li>
            ),
            disabled: true
        });
    }
    if (styleguides.length > 0) {
        result.push(
            {
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
                resource: {
                    id,
                    name,
                    type: ResourceType.STYLEGUIDE
                }
            }))
        );
    }
    return result;
};

interface ResourceDropdownProps {
    disabled: boolean;
    loading: boolean;
    projects: Project[];
    styleguides: Styleguide[];
    search: string;
    onBlur: () => void;
    onFocus: () => void;
    onSearchChange: (value: string) => void;
    onChange: (value: Resource) => void;
}

export const ResourceDropdown: FunctionComponent<ResourceDropdownProps> = ({
    disabled,
    loading,
    projects,
    styleguides,
    search,
    onBlur,
    onFocus,
    onSearchChange,
    onChange
}) => {
    const doesNameIncludesSearch = (
        { name }: { name: string }
    ): boolean => name.toLowerCase().includes(search.toLowerCase());

    const [open, setOpen] = useState(false);

    const filteredProjects = projects.filter(doesNameIncludesSearch);
    const filteredStyleguides = styleguides.filter(doesNameIncludesSearch);
    return (
        <Dropdown
            search={(items): ShorthandCollection<DropdownItemProps> => items}
            open={open}
            searchQuery={search}
            disabled={disabled}
            loading={loading}
            loadingMessage="Loading…"
            noResultsMessage="No project/styleguide to connect"
            checkable
            items={getItems({ loading, projects: filteredProjects, styleguides: filteredStyleguides })}
            placeholder="Select Project/Styleguide"
            onBlur={(): void => {
                setOpen(false);
                onBlur();
            }}
            onFocus={(): void => {
                setOpen(true);
                onFocus();
            }}
            onChange={(_, { value }): void => {
                if (value) {
                    const { resource } = value as { resource: Resource };
                    onChange(resource);
                    setOpen(false);
                }
            }}
            onSearchQueryChange={(_, { searchQuery }): void => {
                onSearchChange(searchQuery ?? "");
            }}
        />
    );
};
