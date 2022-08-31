import { createLogger } from "@logdna/logger";
import { once } from "events";
import chalk from "chalk";
import pino from "pino";
import nrPino from "@newrelic/pino-enricher";
import { SonicBoom } from "sonic-boom";
/* eslint-disable no-console */
const INDENT = 2;

interface Extra {
    meta?: object;
}

interface LogDNAParams {
    apiKey: string;
    environment: string;
}

interface PinoParams {
    logFilePath: string;
    environment: string;
}

interface MultipleLogParams extends LogDNAParams, PinoParams {}

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

const getPino = ({ logFilePath, environment }: PinoParams): LogProvider => {
    const nrPinoConf = nrPino();

    const pinoConf = {
        ...nrPinoConf,
        formatters: {
            ...nrPinoConf.formatters,
            level: (label: string) => ({ level: label })
        },
        base: {
            service: environment === "prod" ? "microsoft-teams-app" : `microsoft-teams-app-${environment}`
        }
    };
    let stream: undefined | SonicBoom;
    const isLocal = ["local", "docker-local"].includes(environment);

    if (!isLocal) {
        stream = pino.destination(logFilePath);

        /*
         This is required for pino to keep on writing logfile after log rotation.
         'SIGHUP' event be triggered by logrotate after log rotation.
         */
        process.on("SIGHUP", () => (stream as SonicBoom).reopen());
    }

    const logger = stream ? pino(pinoConf, stream) : pino(pinoConf);

    return {
        info: (message, { meta }): void => logger.info?.({ meta }, message),
        error: (message, { meta }): void => logger.error?.({ meta }, message),
        flush: async (): Promise<void> => {
            logger.flush();
            await once(logger, "cleared");
        }
    };
};

const getMultipleLogger = ({ apiKey: logDNAApiKey, environment, logFilePath }:MultipleLogParams): LogProvider => {
    const logdnaLogger = getLogDNA({ apiKey: logDNAApiKey, environment });
    const pinoLogger = getPino({ environment, logFilePath });
    return {
        info: (message:string, { meta }): void => {
            logdnaLogger.info(message, { meta });
            pinoLogger.info(message, { meta });
        },
        error: (message:string, { meta }): void => {
            logdnaLogger.error(message, { meta });
            pinoLogger.error(message, { meta });
        },
        flush: async (): Promise<void> => {
            await logdnaLogger.flush();
            await pinoLogger.flush();
        }
    };
};

interface LogProviderGetParams {
    logDNAApiKey?: string;
    environment: string;
    logFilePath: string;
}

const getLogProvider = ({ logDNAApiKey, environment, logFilePath }: LogProviderGetParams): LogProvider => {
    if (logDNAApiKey) {
        return getMultipleLogger({ apiKey: logDNAApiKey, environment, logFilePath });
    }
    return getConsole();
};

export {
    getLogProvider,
    LogProvider
};