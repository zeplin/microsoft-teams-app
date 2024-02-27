import { getLogProvider, LogProvider } from "./logProvider";
import { loggerContext } from "../context";
import { ServerError } from "../../errors";
import { ErrorTracker, getErrorTracker } from "./errorTracker";

enum LogLevel {
    DISABLE,
    ERROR,
    INFO,
}

interface LoggerInitParams {
    sentryDSN?: string;
    environment: string;
    version: string;
    level?: string;
    logFilePath:string
    kubernetes?: boolean;
}

interface Extra {
    meta?: object;
}

class Logger {
    private logProvider!: LogProvider;
    private level!: LogLevel;
    private errorTracker!: ErrorTracker;

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
        sentryDSN,
        version,
        level,
        environment,
        logFilePath,
        kubernetes
    }: LoggerInitParams): void {
        this.level = Logger.toLogLevel(level);
        this.logProvider = getLogProvider({
            environment,
            kubernetes,
            logFilePath
        });

        this.errorTracker = getErrorTracker({
            environment,
            version,
            sentryDSN
        });
    }

    info(message: string, extra?: Extra): void {
        if (this.level >= LogLevel.INFO) {
            this.logProvider.info(
                message,
                {
                    meta: {
                        ...extra?.meta,
                        ...loggerContext.get()
                    }
                }
            );
        }
    }

    error(error: ServerError): void {
        if (this.level >= LogLevel.ERROR) {
            this.logProvider.error(
                error.message,
                {
                    meta: {
                        ...error.toMeta(),
                        ...loggerContext.get()
                    }
                }
            );
        }

        if (error.shouldCapture) {
            this.errorTracker.captureError(
                error,
                {
                    meta: error.toMeta(),
                    context: loggerContext.get()
                }
            );
        }
    }

    async close(): Promise<void> {
        await this.errorTracker?.close(this.errorTracker.SENTRY_CLOSE_TIMEOUT).then(result => {
            if (!result) {
                this.logProvider.error(
                    "Sentry could not be flushed, some error events may have been lost.",
                    { meta: loggerContext.get() });
            }
        });
        await this.logProvider.flush();
    }
}

export const logger = new Logger();
