import { ZeplinApi, Configuration } from "@zeplin/sdk";

interface ZeplinOptions {
    url: string;
}

interface ZeplinConstructorOptions {
    accessToken?: string;
}

export class Zeplin extends ZeplinApi {
    static baseURL: string;
    static init({ url }: ZeplinOptions): void {
        Zeplin.baseURL = url;
    }

    constructor(options?: ZeplinConstructorOptions) {
        super(new Configuration({
            ...options,
            basePath: Zeplin.baseURL
        }));
    }
}
