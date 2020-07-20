import React, {
    FunctionComponent, useEffect, useRef, useState
} from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { Provider, Flex, Input } from "@fluentui/react-northstar";

const Home: FunctionComponent = () => {
    const [input, setInput] = useState("");

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
            microsoftTeams.settings.getSettings(({
                entityId
            }) => {
                setInput(entityId);
            });
        });

        microsoftTeams.settings.registerOnSaveHandler(event => {
            const settings = {
                entityId: inputRef.current,
                contentUrl: "https://591c0b12a354.ngrok.io/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
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
