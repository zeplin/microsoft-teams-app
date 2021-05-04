import { createNamespace } from "cls-hooked";

const namespace = createNamespace("webhook");

export class Context<T> {
    constructor(private key: string) {
    }

    run<R>(value: T, callback: () => R): R {
        return namespace.runAndReturn(() => {
            namespace.set(this.key, value);
            return callback();
        });
    }

    get(): T | undefined {
        return namespace.get(this.key);
    }
}

