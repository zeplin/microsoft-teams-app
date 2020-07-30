import { ProjectWebhooks } from "./ProjectWebhooks";
import { Requester } from "./requester";

interface ZeplinOptions {
    url?: string;
    webhookSecret: string;
}

class Zeplin {
    public projectWebhooks!: ProjectWebhooks;

    init({ url = "https://api.zeplin.dev", webhookSecret }: ZeplinOptions): void {
        const requester = new Requester({ baseURL: `${url}/v1/` });
        this.projectWebhooks = new ProjectWebhooks(requester, webhookSecret);
    }
}

export const zeplin = new Zeplin();
