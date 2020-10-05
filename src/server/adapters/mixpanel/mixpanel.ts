import mixpanelClient from "mixpanel";

type MixpanelInitParams = {
    apiToken: string;
    enabled: boolean;
}

class Mixpanel {
    private enabled = false;
    private mixpanelClient!: mixpanelClient.Mixpanel;

    init({
        apiToken,
        enabled
    }: MixpanelInitParams): void {
        this.enabled = enabled;
        this.mixpanelClient = mixpanelClient.init(apiToken);
    }

    trackEvent(eventName: string, properties: mixpanelClient.PropertyDict): Promise<void> {
        return new Promise((resolve, reject): void => {
            if (!this.enabled) {
                resolve();

                return;
            }

            this.mixpanelClient.track(eventName, properties, err => {
                if (err) {
                    reject(err);

                    return;
                }

                resolve();
            });
        });
    }
}

export const mixpanel = new Mixpanel();