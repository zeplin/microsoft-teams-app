/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
import { NEW_RELIC_LOG_LEVEL, NEW_RELIC_LICENSE_KEY, ENVIRONMENT } from "./config";

export const config = {
    app_name: [`microsoft-teams-app-${ENVIRONMENT}`],
    logging: {
        level: NEW_RELIC_LOG_LEVEL
    },
    agent_enabled: Boolean(NEW_RELIC_LICENSE_KEY),
    license_key: NEW_RELIC_LICENSE_KEY,
    error_collector: {
        enabled: true
    },
    transaction_tracer: {
        transaction_threshold: 1
    },
    rules: {
        ignore: [
            /^\/health/
        ]
    },
    // We already use fluentbit and @newrelic/pino-enricher for newrelic context on logs
    // No need to use any application_logging features on newrelic
    // Careful here if you need to enable application_logging!
    // As of now, newrelic version <v8.14.1 and >v8.12.0 causes custom pino log levels to throw fatal error
    application_logging: {
        enabled: false
    }
};
