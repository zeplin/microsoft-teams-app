import axios from "axios";

class Requester {
    async post(url: string, payload: object): Promise<void> {
        try {
            await axios.post(url, payload);
        } catch (err) {
            if (err.response) {
                // TODO: Better error?
                throw new Error(`Request did not succeed ${err.response}`);
            }

            if (err.request) {
                // TODO: Better error?
                throw new Error(`Request was made but no response is received ${err.request}`);
            }

            // TODO: Better error?
            throw new Error(`Unexpected error ${err.message}`);
        }
    }
}

export const requester = new Requester();