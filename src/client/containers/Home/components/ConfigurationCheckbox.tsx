import React, { FunctionComponent } from "react";
import { Checkbox, Flex, Text } from "@fluentui/react-northstar";

interface ConfigurationCheckbox {
    title: string;
    description: string;
}

export const ConfigurationCheckbox: FunctionComponent<ConfigurationCheckbox> = ({
    title,
    description
}) => (
    <div>
        <Checkbox defaultChecked label={
            <Flex fill column>
                <Text>{title}</Text>
                <Text size="small">{description}</Text>
            </Flex>
        } />
    </div>
);
