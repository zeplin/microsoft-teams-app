import axios from "axios";
import { ServiceError } from "server/errors";

class Requester {
    async post(url: string, payload: object): Promise<void> {
        try {
            await axios.post(url, payload);
        } catch (err) {
            if (err.response) {
                throw new ServiceError("Request did not succeed", {
                    extra: { response: err.response }
                });
            }

            if (err.request) {
                throw new ServiceError("Request was made but no response is received", {
                    extra: { request: err.request }
                });
            }

            throw new ServiceError("Unexpected error", {
                extra: { message: err.message }
            });
        }
    }
}

export const requester = new Requester();