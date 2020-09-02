import express, { Express, RequestHandler, Router as createRouter } from "express";
import next from "next";
import { parse } from "url";
import { Config } from "./config";
import { initAdapters } from "./adapters";
import { initFeatures } from "./features";
import path from "path";
import { handleError } from "./middlewares";
import { ServerError } from "./errors";
import { sentry } from "./adapters/sentry";

class App {
    private expressApp?: Express;

    private handleHealthCheck: RequestHandler = (req, res) => {
        res.json({ status: "pass" });
    }

    async init(config: Config): Promise<void> {
        await initAdapters(config);

        this.expressApp = express();

        const nextApp = next({
            dev: config.IS_DEV,
            dir: path.join(__dirname, "../client")
        });
        await nextApp.prepare();

        const apiRouter = createRouter({ mergeParams: true });

        initFeatures(apiRouter, config);

        this.expressApp.get("/health", this.handleHealthCheck);

        this.expressApp.use(
            "/api",
            sentry.requestHandler,
            apiRouter,
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
        if (!this.expressApp) {
            throw new ServerError("App is tried to be listened before initialized");
        }

        return new Promise((resolve, reject) => {
            this.expressApp.listen(port, err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }
}

export const app = new App();
