import chalk from "chalk";
import pino, { Logger } from "pino";
import nrPino from "@newrelic/pino-enricher";
/* eslint-disable no-console */
const INDENT = 2;

interface Extra {
    meta?: object;
}

interface PinoParams {
    logFilePath: string;
    kubernetes?: boolean;
    environment: string;
}

interface LogProvider {
    info(message: string, extra: Extra): void;
    error(message: string, extra: Extra): void;
    flush: () => Promise<void>;
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

const getPino = ({ logFilePath, kubernetes, environment }: PinoParams): LogProvider => {
    const nrPinoConf = nrPino();

    const pinoConf = {
        ...nrPinoConf,
        timestamp: () => `,"timestamp": "${new Date().toISOString()}"`,
        formatters: {
            ...nrPinoConf.formatters,
            level: (label: string) => ({ level: label })
        },
        base: {
            service: environment === "prod" ? "microsoft-teams-app" : `microsoft-teams-app-${environment}`
        }
    };

    let logger: Logger;
    if (!kubernetes && logFilePath) {
        const stream = pino.destination(logFilePath);

        /*
         This is required for pino to keep on writing logfile after log rotation.
         'SIGHUP' event be triggered by logrotate after log rotation.
         */
        process.on("SIGHUP", () => stream.reopen());
        logger = pino(pinoConf, stream);
    } else {
        logger = pino(pinoConf);
    }

    return {
        info: (message, { meta }): void => logger.info?.({ meta }, message),
        error: (message, { meta }): void => logger.error?.({ meta }, message),
        flush: (): Promise<void> => new Promise(resolve => {
            logger.flush(() => {
                resolve();
            });
        })
    };
};

interface LogProviderGetParams {
    environment: string;
    logFilePath: string;
    kubernetes?: boolean;
}

const getLogProvider = ({ environment, kubernetes, logFilePath }: LogProviderGetParams): LogProvider => {
    if (logFilePath || kubernetes) {
        return getPino({ logFilePath, kubernetes, environment });
    }
    return getConsole();
};

export {
    getLogProvider,
    LogProvider
};