import { createLogger } from "@logdna/logger";
import { once } from "events";
import chalk from "chalk";
/* eslint-disable no-console */
const INDENT = 2;

interface Extra {
    meta?: object;
}

interface LogDNAParams {
    apiKey: string;
    environment: string;
}

interface LogProvider {
    info(message: string, extra: Extra): void;
    error(message: string, extra: Extra): void;
    flush: () => Promise<void> ;
}

const getConsole = (): LogProvider => ({
    info: (message, { meta }): void => {
        console.log(chalk`[{cyan INFO}]: ${message}`);
        if (meta && Object.keys(meta).length > 0) {
            console.log(JSON.stringify({ meta }, null, INDENT));
        }
    },
    error: (message, { meta }): void => {
        console.log(chalk`[{red ERROR}]: ${message}`);
        if (meta && Object.keys(meta).length > 0) {
            console.log(JSON.stringify({ meta }, null, INDENT));
        }
    },
    flush: (): Promise<void> => Promise.resolve()
});

const getLogDNA = ({ apiKey, environment }: LogDNAParams): LogProvider => {
    const logger = createLogger(
        apiKey,
        {
            app: `microsoft-teams-app-${environment}`,
            env: environment,
            indexMeta: true
        }
    );
    return {
        info: (message, { meta }): void => logger.info?.(message, { meta }),
        error: (message, { meta }): void => logger.error?.(message, { meta }),
        flush: async (): Promise<void> => {
            logger.flush();
            await once(logger, "cleared");
        }
    };
};

interface LogProviderGetParams {
    logDNAApiKey?: string;
    environment: string;
}

const getLogProvider = ({ logDNAApiKey, environment }: LogProviderGetParams): LogProvider => {
    if (logDNAApiKey) {
        return getLogDNA({ apiKey: logDNAApiKey, environment });
    }
    return getConsole();
};

export {
    getLogProvider,
    LogProvider
};