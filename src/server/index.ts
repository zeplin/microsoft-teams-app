import { app } from "./app";
import * as config from "./config";
import { sentry } from "./adapters";

async function drive(): Promise<void> {
    // Initialize NextJS and routes
    await app.init(config);

    // Listen for the requests
    await app.listen(config.PORT);

    // eslint-disable-next-line no-console
    console.log(`> Server listening at http://localhost:${config.PORT} as ${config.ENVIRONMENT}`);
}

drive().catch(async error => {
    sentry.captureException(error);
    await sentry.flush();
});
