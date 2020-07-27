module.exports = {
    moduleDirectories: ["node_modules", "src"],
    coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    collectCoverageFrom: [
        "<rootDir>/src/**/*.ts",
        "<rootDir>/src/**/*.tsx",
        "!<rootDir>/src/server/test/**/*.ts"
    ]
};
