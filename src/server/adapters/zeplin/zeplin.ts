import { ProjectWebhooks } from "./ProjectWebhooks";
import { Requester } from "./requester";
import { StyleguideWebhooks } from "./StyleguideWebhooks";

interface ZeplinOptions {
    url: string;
    webhookSecret: string;
}

class Zeplin {
    public projectWebhooks!: ProjectWebhooks;
    public styleguideWebhooks!: StyleguideWebhooks;

    init({ url, webhookSecret }: ZeplinOptions): void {
        const requester = new Requester({ baseURL: `${url}/v1/` });
        this.projectWebhooks = new ProjectWebhooks(requester, webhookSecret);
        this.styleguideWebhooks = new StyleguideWebhooks(requester, webhookSecret);
    }
}

export const zeplin = new Zeplin();
