import "newrelic";

import { app } from "./app";
import * as config from "./config";
import { closeAdapters, logger } from "./adapters";
import { ServerError } from "./errors";

async function drive(): Promise<void> {
    if (!config.validateConfig(config)) {
        throw new ServerError("Config is not initialized");
    }

    // Initialize NextJS and routes
    await app.init(config);

    // Listen for the requests
    await app.listen(config.PORT);

    logger.info(`> Server listening at http://localhost:${config.PORT} in ${config.ENVIRONMENT} as ${config.IS_DEV ? "development" : "production"}`);
}

drive().catch(async error => {
    logger.error(ServerError.fromUnknown(error));

    try {
        await closeAdapters();
    } catch (closeAdaptersError) {
        logger.error(ServerError.fromUnknown(closeAdaptersError));
    }

    // eslint-disable-next-line no-process-exit
    process.exit(1);
});
