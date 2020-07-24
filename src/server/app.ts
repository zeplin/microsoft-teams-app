import express, { Express } from "express";
import next from "next";
import { parse } from "url";

type AppInitParams = {
    dev: boolean;
}

class App {
    private expressApp?: Express;

    async init({ dev }: AppInitParams): Promise<void> {
        this.expressApp = express();

        const nextApp = next({ dev });
        await nextApp.prepare();

        this.expressApp.get("/health", (_, res) => {
            res.json({ status: "pass" });
        });

        // Add NextJS app as the last middleware
        this.expressApp.use((req, res) => {
            const parsedUrl = parse(req.url, true);
            nextApp.getRequestHandler()(req, res, parsedUrl);
        });
    }

    listen(port: number): Promise<void> {
        if (!this.expressApp) {
            throw new Error("App is not initialized");
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