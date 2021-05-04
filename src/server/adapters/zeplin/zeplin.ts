import { ZeplinApi, Configuration } from "@zeplin/sdk";
import axios from "axios";
import { ServerError } from "../../errors";

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
        const axiosInstance = axios.create();

        axiosInstance.interceptors.response.use(
            val => val,
            error => {
                if (error.response) {
                    throw new ServerError(error.response.data.message, { statusCode: error.response.status });
                }
                throw new ServerError(error?.message ?? String(error));
            }
        );
        super(
            new Configuration({
                ...options,
                basePath: Zeplin.baseURL
            }),
            Zeplin.baseURL,
            axiosInstance
        );
    }
}
