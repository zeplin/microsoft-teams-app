import express, { Express, RequestHandler } from "express";
import next from "next";
import { parse } from "url";
import * as SentryClient from "@sentry/node";
import path from "path";
import helmet from "helmet";

import { Config } from "./config";
import { initAdapters } from "./adapters";
import { router } from "./router";
import { handleError, loggerMiddleware } from "./middlewares";
import { ServerError } from "./errors";
import { initializeQueueListener } from "./queueListener";
import { healthCheckService } from "./utils/healthcheck";
import { SERVICE_UNAVAILABLE, OK } from "http-status-codes";
import { createHttpTerminator, HttpTerminator } from "http-terminator";
import { logger } from "./adapters/logger";

class App {
    private expressApp?: Express;
    private httpTerminator?: HttpTerminator;
    private handleHealthCheck: RequestHandler = (req, res) => {
        if (healthCheckService.getHealthStatus()) {
            res.status(OK).json({ status: "OK" });
            return;
        }
        res.status(SERVICE_UNAVAILABLE).send();
    };

    async init(config: Config): Promise<void> {
        await initAdapters(config);

        initializeQueueListener();

        this.expressApp = express();

        const nextApp = next({
            dev: config.IS_DEV,
            dir: path.join(__dirname, "../client")
        });
        await nextApp.prepare();

        this.expressApp.use(helmet.hsts());
        this.expressApp.disable("x-powered-by");
        this.expressApp.get("/health", this.handleHealthCheck);

        this.expressApp.use(
            "/api",
            SentryClient.Handlers.requestHandler(),
            loggerMiddleware,
            router,
            handleError
        );

        // Add NextJS app as the last middleware
        this.expressApp.use((req, res) => {
            if (!req.url.startsWith("/_next/")) {
                console.log(new Date(), "NEXTJS", req.url);
            }
            const parsedUrl = parse(req.url, true);
            nextApp.getRequestHandler()(req, res, parsedUrl);
        });
    }

    listen(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.expressApp) {
                const server = this.expressApp.listen(port, err => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    this.httpTerminator = createHttpTerminator({ server });
                    logger.info(`Webserver is listening on port ${port}`);
                    resolve();
                });
            } else {
                reject(new ServerError("App is tried to be listened before initialized"));
            }
        });
    }

    async close(): Promise<void> {
        if (this.httpTerminator) {
            await this.httpTerminator.terminate();

            delete this.httpTerminator;
        }
    }
}

export const app = new App();
