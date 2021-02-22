import { Context } from "./context";

export interface LoggerContext {
    correlationId: string;
}

export const loggerContext = new Context<LoggerContext>("correlationId");
