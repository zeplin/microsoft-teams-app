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
import * as http from "http";
import { SERVICE_UNAVAILABLE, OK } from "http-status-codes";
import { createHttpTerminator } from "http-terminator";

class App {
    private expressApp?: Express;
    private server?: http.Server;
    private handleHealthCheck: RequestHandler = (req, res) => {
        if (healthCheckService.getHealthStatus()) {
            res.status(OK).send();
            return;
        }
        res.status(SERVICE_UNAVAILABLE).send();
    };

    async init(config: Config): Promise<void> {
        await initAdapters(config);

        await initializeQueueListener();

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
            const parsedUrl = parse(req.url, true);
            nextApp.getRequestHandler()(req, res, parsedUrl);
        });
    }

    listen(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.expressApp) {
                this.server = this.expressApp.listen(port, err => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve();
                });
            } else {
                reject(new ServerError("App is tried to be listened before initialized"));
            }
        });
    }

    async close(): Promise<void> {
        if (this.server) {
            const httpTerminator = createHttpTerminator({ server: this.server });
            await httpTerminator.terminate();

            delete this.server;
        }
    }
}

export const app = new App();
