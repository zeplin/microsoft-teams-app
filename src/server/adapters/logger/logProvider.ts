import { createLogger } from "@logdna/logger";
import { once } from "events";
import chalk from "chalk";

interface Extra {
    meta?: object;
}

interface LogDNAParams {
    apiKey: string;
    environment: string;
}

const getConsole = (): LogProvider => ({
    info: (message, { meta }): void => {
        const shouldLogMeta = meta && Object.keys(meta).length > 0;
        // eslint-disable-next-line no-console
        console.log(chalk`[{cyan INFO}]: ${message}`, shouldLogMeta ? { meta } : "");
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
        info: (message, { meta }): void => logger.info(message, { meta }),
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
export const getLogProvider = ({ logDNAApiKey, environment }: LogProviderGetParams): LogProvider => {
    if (logDNAApiKey) {
        return getLogDNA({ apiKey: logDNAApiKey, environment });
    }
    return getConsole();
};

export interface LogProvider {
    info(message: string, extra: Extra): void;
    flush: () => Promise<void> ;
}

