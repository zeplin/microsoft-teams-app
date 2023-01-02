import { once } from "events";
import chalk from "chalk";
import pino from "pino";
import nrPino from "@newrelic/pino-enricher";
/* eslint-disable no-console */
const INDENT = 2;

interface Extra {
    meta?: object;
}

interface PinoParams {
    logFilePath: string;
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

const getPino = ({ logFilePath, environment }: PinoParams): LogProvider => {
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
    const stream = pino.destination(logFilePath);
    /*
     This is required for pino to keep on writing logfile after log rotation.
     'SIGHUP' event be triggered by logrotate after log rotation.
     */
    process.on("SIGHUP", () => stream.reopen());

    const logger = pino(pinoConf, stream);

    return {
        info: (message, { meta }): void => logger.info?.({ meta }, message),
        error: (message, { meta }): void => logger.error?.({ meta }, message),
        flush: async (): Promise<void> => {
            logger.flush();
            await once(logger, "cleared");
        }
    };
};

interface LogProviderGetParams {
    environment: string;
    logFilePath: string;
}

const getLogProvider = ({ environment, logFilePath }: LogProviderGetParams): LogProvider => {
    if (logFilePath) {
        return getPino({ logFilePath, environment });
    }
    return getConsole();
};

export {
    getLogProvider,
    LogProvider
};