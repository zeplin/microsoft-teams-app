import "newrelic";

import { app } from "./app";
import * as config from "./config";
import { closeAdapters, logger } from "./adapters";
import { ServerError } from "./errors";
import { healthCheckService } from "./utils/healthcheck";

async function drive(): Promise<void> {
    if (!config.validateConfig(config)) {
        throw new ServerError("Config is not initialized");
    }

    // Initialize NextJS and routes
    await app.init(config);

    // Listen for the requests
    await app.listen(config.PORT);
    healthCheckService.markHealthy();
    logger.info(`> Server listening at http://localhost:${config.PORT} in ${config.ENVIRONMENT} as ${config.IS_DEV ? "development" : "production"}`);
}

drive().catch(async error => {
    logger.error(ServerError.fromUnknown(error));
    healthCheckService.markUnhealthy();
    await shutdown(1);
});

async function shutdown(exitCode: number) {
    try {
        await closeAdapters();

        logger.info("Closing server…");
        await app.close();

        logger.info(`${exitCode > 0 ? "Unexpected" : "Graceful"} shutdown completed, exiting.`);
    } catch (err) {
        logger.error(ServerError.fromUnknown(err));
    } finally {
        await logger.close();
        // eslint-disable-next-line no-process-exit
        process.exit(exitCode);
    }
}

["SIGINT", "SIGTERM"].forEach(signal => {
    process.on(signal, () => {
        logger.info(`${signal} received, preparing for grace shutdown.`);
        healthCheckService.markUnhealthy();
        setTimeout(() => shutdown(0), config.SHUTDOWN_DELAY);
    });
});