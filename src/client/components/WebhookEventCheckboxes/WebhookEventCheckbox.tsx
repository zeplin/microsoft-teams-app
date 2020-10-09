import React, { FunctionComponent } from "react";
import { Checkbox, Flex, Text } from "@fluentui/react-northstar";

interface ConfigurationCheckboxProps {
    disabled: boolean;
    checked: boolean;
    title: string;
    description: string;
    onChange: () => void;
}

export const WebhookEventCheckbox: FunctionComponent<ConfigurationCheckboxProps> = ({
    disabled,
    checked,
    title,
    description,
    onChange
}) => (
    <div>
        <Checkbox
            disabled={disabled}
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
