class HealthCheck {
    private health: boolean;

    constructor() {
        this.health = false;
    }

    markHealthy(): void {
        this.health = true;
    }

    markUnhealthy(): void {
        this.health = false;
    }

    getHealthStatus(): boolean {
        return this.health;
    }
}

const healthCheckService = new HealthCheck();

export { healthCheckService };
