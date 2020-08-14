import { ProjectWebhooks } from "./ProjectWebhooks";
import { Requester } from "./requester";
import { StyleguideWebhooks } from "./StyleguideWebhooks";
import { Auth } from "./Auth";
import { Organizations } from "./Organizations";

interface ZeplinOptions {
    url: string;
}

class Zeplin {
    public projectWebhooks!: ProjectWebhooks;
    public styleguideWebhooks!: StyleguideWebhooks;
    public organizations!: Organizations;
    public auth!: Auth;

    init({ url }: ZeplinOptions): void {
        const requester = new Requester({ baseURL: `${url}/v1/` });
        this.projectWebhooks = new ProjectWebhooks(requester);
        this.styleguideWebhooks = new StyleguideWebhooks(requester);
        this.organizations = new Organizations(requester);
        this.auth = new Auth(requester);
    }
}

export const zeplin = new Zeplin();
