import { getLogProvider, LogProvider } from "./logProvider";
import { loggerContext } from "../../context";

enum LogLevel {
    DISABLE,
    ERROR,
    INFO,
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
    private logger!: LogProvider;
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
        this.logger = getLogProvider({
            logDNAApiKey: apiKey,
            environment
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

    flush(): Promise<void> {
        return this.logger.flush();
    }
}

export const logger = new Logger();
