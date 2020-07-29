import axios, { AxiosInstance } from "axios";
import { ProjectWebhook } from "./ProjectWebhook";

class Zeplin {
    private instance: AxiosInstance;
    public projectWebhook: ProjectWebhook;

    init(url: string, webhookSecret: string): void {
        this.instance = axios.create({ baseURL: `${url}/v1/` });
        this.projectWebhook = new ProjectWebhook(this.instance, webhookSecret);
    }
}

export const zeplin = new Zeplin();
