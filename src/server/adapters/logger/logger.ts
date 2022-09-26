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
    logDNAApiKey?: string;
    sentryDSN?: string;
    environment: string;
    version: string;
    level?: string;
    logFilePath:string
}

interface Extra {
    meta?: object;
}

class Logger {
    private logger!: LogProvider;
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
        logDNAApiKey,
        sentryDSN,
        version,
        level,
        environment,
        logFilePath
    }: LoggerInitParams): void {
        this.level = Logger.toLogLevel(level);
        this.logger = getLogProvider({
            logDNAApiKey,
            environment,
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
            this.logger.info(
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
            this.logger.error(
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
    async flush(): Promise<void> {
        await this.errorTracker.flush();
        await this.logger.flush();
    }
}

export const logger = new Logger();
