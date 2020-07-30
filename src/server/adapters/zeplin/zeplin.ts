import { ProjectWebhooks } from "./ProjectWebhooks";
import { Requester } from "./requester";
import { StyleguideWebhooks } from "./StyleguideWebhooks";

interface ZeplinOptions {
    url: string;
}

class Zeplin {
    public projectWebhooks!: ProjectWebhooks;
    public styleguideWebhooks!: StyleguideWebhooks;

    init({ url }: ZeplinOptions): void {
        const requester = new Requester({ baseURL: `${url}/v1/` });
        this.projectWebhooks = new ProjectWebhooks(requester);
        this.styleguideWebhooks = new StyleguideWebhooks(requester);
    }
}

export const zeplin = new Zeplin();
