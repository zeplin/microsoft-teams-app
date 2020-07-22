import { app } from "./app";

// eslint-disable-next-line no-process-env
const ENVIRONMENT = process.env.NODE_ENV;
// eslint-disable-next-line no-process-env
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function drive(): Promise<void> {
    const dev = ENVIRONMENT !== "production";
    // Initialize environment variables and the app
    await app.init({ dev });

    // Listen for the requests
    await app.listen(port);

    // eslint-disable-next-line no-console
    console.log(`> Server listening at http://localhost:${port} as ${dev ? "development" : ENVIRONMENT}`);
}

drive();