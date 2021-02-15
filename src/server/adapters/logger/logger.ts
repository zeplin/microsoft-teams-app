import * as LogDNA from "@logdna/logger";
import { once } from "events";

enum LogLevel {
    DISABLE,
    INFO,
    ERROR,
}

interface LoggerInitParams {
    apiKey: string;
    environment: string;
    level?: string;
}

interface Extra {
    meta?: object;
}

class Logger {
    private logger?: LogDNA.Logger;
    private level!: LogLevel;

    private static toLogLevel(level?: string): LogLevel {
        switch (level?.toLowerCase()) {
            case "info":
                return LogLevel.INFO;
            case "error":
                return LogLevel.ERROR;
            case "disable":
            default:
                return LogLevel.DISABLE;
        }
    }

    init({
        apiKey,
        level,
        environment
    }: LoggerInitParams): void {
        this.level = Logger.toLogLevel(level);
        if (this.level > LogLevel.DISABLE) {
            this.logger = LogDNA.createLogger(
                apiKey,
                {
                    app: `microsoft-teams-app-${environment}`,
                    env: environment,
                    indexMeta: true
                }
            );
        }
    }

    info(message: string, extra?: Extra): void {
        if (this.level <= LogLevel.INFO) {
            this.logger?.info(message, { meta: extra?.meta });
        }
    }

    async flush(): Promise<void> {
        if (this.logger) {
            this.logger?.flush();
            await once(this.logger, "cleared");
        }
    }
}

export const logger = new Logger();
