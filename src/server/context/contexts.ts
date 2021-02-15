import { Context } from "./context";

interface LoggerContext {
    correlationId: string;
}

export const loggerContext = new Context<LoggerContext>("correlationId");
