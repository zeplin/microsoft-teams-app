import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ServerError } from "../../errors";

export class Requester {
    private instance: AxiosInstance;
    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(config);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private throwZeplinError(error: any): never {
        if (error.response) {
            throw new ServerError(error.response.data.message, { statusCode: error.response.status });
        }
        throw new ServerError(error?.message ?? String(error));
    }

    async delete(url: string, config?: AxiosRequestConfig): Promise<void> {
        try {
            await this.instance.delete(url, config);
        } catch (error) {
            this.throwZeplinError(error);
        }
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const { data } = await this.instance.get<T>(url, config);
            return data;
        } catch (error) {
            this.throwZeplinError(error);
        }
    }

    async patch(url: string, data: object, config?: AxiosRequestConfig): Promise<void> {
        try {
            await this.instance.patch(url, data, config);
        } catch (error) {
            this.throwZeplinError(error);
        }
    }

    async createResource(url: string, data: object, config?: AxiosRequestConfig): Promise<string> {
        try {
            const { data: { id } } = await this.instance.post<{ id: string }>(url, data, config);
            return id;
        } catch (error) {
            this.throwZeplinError(error);
        }
    }

    async post<T = object>(url: string, data: object, config?: AxiosRequestConfig): Promise<T> {
        try {
            const { data: result } = await this.instance.post<T>(url, data, config);
            return result;
        } catch (error) {
            this.throwZeplinError(error);
        }
    }

    getUri(config?: AxiosRequestConfig): string {
        return `${this.instance.defaults.baseURL}${this.instance.getUri(config)}`;
    }
}
