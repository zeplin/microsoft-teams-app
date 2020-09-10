import express, { Express, RequestHandler } from "express";
import next from "next";
import { parse } from "url";
import { Config } from "./config";
import { initAdapters, sentry } from "./adapters";
import { router } from "./router";
import path from "path";
import { handleError } from "./middlewares";
import { ServerError } from "./errors";
import { initializeQueueListener } from "./queueListener";

class App {
    private expressApp?: Express;

    private handleHealthCheck: RequestHandler = (req, res) => {
        res.json({ status: "pass" });
    }

    async init(config: Config): Promise<void> {
        await initAdapters(config);

        initializeQueueListener();

        this.expressApp = express();

        const nextApp = next({
            dev: config.IS_DEV,
            dir: path.join(__dirname, "../client")
        });
        await nextApp.prepare();

        this.expressApp.get("/health", this.handleHealthCheck);

        this.expressApp.use(
            "/api",
            sentry.requestHandler,
            router,
            sentry.errorHandler,
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
                this.expressApp.listen(port, err => {
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
}

export const app = new App();
