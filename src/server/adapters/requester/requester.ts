import axios, { AxiosError } from "axios";
import { ServerError } from "../../errors";

class Requester {
    async post(url: string, payload: object): Promise<void> {
        try {
            await axios.post(url, payload);
        } catch (err) {
            const error = err as AxiosError;
            const configExtra = {
                url: error.config.url,
                headers: error.config.headers,
                data: error.config.data,
                responseType: error.config.responseType
            };

            if (error.response) {
                throw new ServerError("Request did not succeed", {
                    statusCode: error.response.status,
                    extra: {
                        message: error.message,
                        response: {
                            body: error.response.data,
                            headers: error.response.headers,
                            status: error.response.status
                        },
                        config: configExtra
                    }
                });
            }

            if (error.request) {
                throw new ServerError("Request was made but no response is received", {
                    extra: { config: configExtra }
                });
            }

            throw new ServerError("Unexpected error", {
                extra: { message: error.message }
            });
        }
    }
}

export const requester = new Requester();
