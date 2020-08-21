import { ProjectWebhooks } from "./ProjectWebhooks";
import { Requester } from "./requester";
import { StyleguideWebhooks } from "./StyleguideWebhooks";
import { Auth } from "./Auth";
import { Organizations } from "./Organizations";
import { Projects } from "./Projects";
import { Styleguides } from "./Styleguides";

interface ZeplinOptions {
    url: string;
}

class Zeplin {
    public auth!: Auth;
    public projectWebhooks!: ProjectWebhooks;
    public styleguideWebhooks!: StyleguideWebhooks;
    public organizations!: Organizations;
    public projects!: Projects;
    public styleguides!: Styleguides;

    init({ url }: ZeplinOptions): void {
        const requester = new Requester({ baseURL: `${url}/v1/` });

        this.auth = new Auth(requester);
        this.projectWebhooks = new ProjectWebhooks(requester);
        this.styleguideWebhooks = new StyleguideWebhooks(requester);
        this.organizations = new Organizations(requester);
        this.projects = new Projects(requester);
        this.styleguides = new Styleguides(requester);
    }
}

export const zeplin = new Zeplin();
