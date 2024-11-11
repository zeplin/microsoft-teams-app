import { Context } from "./context";

export type LoggerContext = {
    correlationId: string;
}

export const loggerContext = new Context<LoggerContext>("correlationId");
