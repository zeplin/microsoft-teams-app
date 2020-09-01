module.exports = {
    testEnvironment: "node",
    collectCoverageFrom: [
        "<rootDir>/**/*.ts",
        "!<rootDir>/test/**/*.ts"
    ],
    snapshotSerializers: ["<rootDir>/test/helpers/messageCardSerializer.ts"],
    setupFiles: ["./test/helpers/setupMocks.ts"]
};
