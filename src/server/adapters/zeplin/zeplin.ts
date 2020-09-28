import { Requester } from "./requester";
import { Webhooks } from "./webhooks";
import { Auth } from "./Auth";
import { Organizations } from "./Organizations";
import { Projects } from "./Projects";
import { Styleguides } from "./Styleguides";
import { Me } from "./Me";

interface ZeplinOptions {
    url: string;
}

class Zeplin {
    public auth!: Auth;
    public webhooks!: Webhooks;
    public organizations!: Organizations;
    public projects!: Projects;
    public styleguides!: Styleguides;
    public me!: Me;

    init({ url }: ZeplinOptions): void {
        const requester = new Requester({ baseURL: `${url}/v1/` });

        this.auth = new Auth(requester);
        this.webhooks = new Webhooks(requester);
        this.organizations = new Organizations(requester);
        this.projects = new Projects(requester);
        this.styleguides = new Styleguides(requester);
        this.me = new Me(requester);
    }
}

export const zeplin = new Zeplin();
