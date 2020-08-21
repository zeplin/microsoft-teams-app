import React, { FunctionComponent } from "react";
import { Checkbox, Flex, Text } from "@fluentui/react-northstar";

interface ConfigurationCheckboxProps {
    checked: boolean;
    title: string;
    description: string;
    onChange: () => void;
}

export const ConfigurationCheckbox: FunctionComponent<ConfigurationCheckboxProps> = ({
    checked,
    title,
    description,
    onChange
}) => (
    <div>
        <Checkbox
            checked={checked}
            defaultChecked
            label={
                <Flex fill column>
                    <Text>{title}</Text>
                    <Text size="small">{description}</Text>
                </Flex>
            }
            onChange={onChange} />
    </div>
);
