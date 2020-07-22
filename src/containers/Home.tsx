import React, {
    FunctionComponent, useEffect, useRef, useState
} from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { Provider, Flex, Input } from "@fluentui/react-northstar";
import { BASE_URL } from "config";

const Home: FunctionComponent = () => {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Workaround: microsoftTeams.settings.registerOnSaveHandler have to be called only once.
     * When the variable `input` is dependency of the useEffect of register functions, then the sdk produce error
     * For more info: https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
     */
    const inputRef = useRef(input);

    useEffect(() => {
        inputRef.current = input;
    }, [input]);

    useEffect(() => {
        microsoftTeams.initialize(() => {
            microsoftTeams.appInitialization.notifySuccess();
            microsoftTeams.settings.getSettings(({ entityId }) => {
                setInput(entityId);
                setIsLoading(false);
            });
        });

        microsoftTeams.settings.registerOnSaveHandler(event => {
            const settings = {
                entityId: inputRef.current,
                contentUrl: `${BASE_URL}/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
                configName: inputRef.current
            };
            microsoftTeams.settings.setSettings(settings);
            event.notifySuccess();
        });

        microsoftTeams.settings.registerOnRemoveHandler(event => {
            event.notifySuccess();
        });
    }, []);

    return (
        <Provider>
            <Flex fill={true}>
                <Flex.Item>
                    <Input
                        disabled={isLoading}
                        value={input}
                        onChange={(ignore, { value }): void => {
                            setInput(value);
                            microsoftTeams.settings.setValidityState(Boolean(value));
                        }}
                    />
                </Flex.Item>
            </Flex>
        </Provider>
    );
};

export default Home;
