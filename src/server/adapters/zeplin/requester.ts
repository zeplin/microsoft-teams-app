import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ZeplinError } from "./ZeplinError";
import { INTERNAL_SERVER_ERROR } from "http-status-codes";

export class Requester {
    private instance: AxiosInstance;
    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(config);
    }

    async delete(url: string, config?: AxiosRequestConfig): Promise<void> {
        try {
            await this.instance.delete(url, config);
        } catch (error) {
            if (error.response) {
                throw new ZeplinError(error.response.data.message, { statusCode: error.response.status });
            } else {
                throw new ZeplinError(error.message, { statusCode: INTERNAL_SERVER_ERROR });
            }
        }
    }

    async get<T = object>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const { data } = await this.instance.get<T>(url, config);
            return data;
        } catch (error) {
            if (error.response) {
                throw new ZeplinError(error.response.data.message, { statusCode: error.response.status });
            } else {
                throw new ZeplinError(error.message, { statusCode: INTERNAL_SERVER_ERROR });
            }
        }
    }

    async patch(url: string, data: object, config?: AxiosRequestConfig): Promise<void> {
        try {
            await this.instance.patch(url, data, config);
        } catch (error) {
            if (error.response) {
                throw new ZeplinError(error.response.data.message, { statusCode: error.response.status });
            } else {
                throw new ZeplinError(error.message, { statusCode: INTERNAL_SERVER_ERROR });
            }
        }
    }

    async post(url: string, data: object, config?: AxiosRequestConfig): Promise<string> {
        try {
            const { data: { id } } = await this.instance.post<{ id: string }>(url, data, config);
            return id;
        } catch (error) {
            if (error.response) {
                throw new ZeplinError(error.response.data.message, { statusCode: error.response.status });
            } else {
                throw new ZeplinError(error.message, { statusCode: INTERNAL_SERVER_ERROR });
            }
        }
    }
}
