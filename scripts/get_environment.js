#!/usr/bin/env node
// eslint-disable-next-line no-process-env
const env = Object.entries(process.env)
    .filter(([key]) => /^NEXT_(PRIVATE|PUBLIC)/.test(key))
    .map(([Key, Value]) => ({ Key, Value, Secure: true }));

// eslint-disable-next-line no-console
console.log(JSON.stringify(env));
