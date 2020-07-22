import { app } from "./app";
import { getConfig } from "../config";

// eslint-disable-next-line no-process-env
const ENVIRONMENT = process.env.NODE_ENV;

async function drive(): Promise<void> {
    const dev = ENVIRONMENT !== "production";
    // Initialize environment variables and the app
    await app.init({ dev });

    const port = getConfig().PORT;

    // Listen for the requests
    await app.listen(port);

    // eslint-disable-next-line no-console
    console.log(`> Server listening at http://localhost:${port} as ${dev ? "development" : ENVIRONMENT}`);
}

drive();