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
    }
};
