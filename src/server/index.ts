import { app } from "./app";
import { PORT, ENVIRONMENT } from "../config";

async function drive(): Promise<void> {
    // Initialize environment variables and the app
    await app.init({ dev: ENVIRONMENT !== "production" });

    // Listen for the requests
    await app.listen(PORT);

    // eslint-disable-next-line no-console
    console.log(`> Server listening at http://localhost:${PORT} as ${ENVIRONMENT}`);
}

drive();