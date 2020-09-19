import React, { FunctionComponent, ReactElement, useState } from "react";
import { Divider, Dropdown, DropdownItemProps, ShorthandCollection } from "@fluentui/react-northstar";

import { Project, Resource, ResourceType, Styleguide } from "../../../../constants";

interface ResourceDropdownProps {
    disabled: boolean;
    loading: boolean;
    projects: Project[];
    styleguides: Styleguide[];
    search: string;
    onBlur: () => void;
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
            checkable
            items={
                loading
                    ? []
                    : [
                        filteredProjects.length > 0 && {
                            key: "Project Header",
                            header: "Projects",
                            disabled: true,
                            styles: {
                                "font-weight": "bolder"
                            }
                        },
                        ...filteredProjects.map(({ id, name }) => ({
                            key: id,
                            header: name,
                            resource: {
                                id,
                                name,
                                type: ResourceType.PROJECT
                            }
                        })),
                        filteredProjects.length > 0 && filteredStyleguides.length > 0 && {
                            key: "Seperator",
                            as: (): ReactElement => <Divider />,
                            disabled: true
                        },
                        filteredStyleguides.length > 0 && {
                            key: "Styleguide Header",
                            header: "Styleguides",
                            disabled: true,
                            styles: {
                                "font-weight": "bolder"
                            }
                        },
                        ...filteredStyleguides.map(({ id, name }) => ({
                            key: id,
                            header: name,
                            resource: {
                                id,
                                name,
                                type: ResourceType.STYLEGUIDE
                            }
                        }))
                    ]
            }
            placeholder="Select Project/Styleguide"
            onBlur={(): void => {
                setOpen(false);
                onBlur();
            }}
            onFocus={(): void => {
                setOpen(true);
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
