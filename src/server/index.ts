import { app } from "./app";
import * as config from "../config";

async function drive(): Promise<void> {
    // Initialize NextJS and routes
    await app.init(config);

    // Listen for the requests
    await app.listen(config.PORT);

    // eslint-disable-next-line no-console
    console.log(`> Server listening at http://localhost:${config.PORT} as ${config.ENVIRONMENT}`);
}

drive();
