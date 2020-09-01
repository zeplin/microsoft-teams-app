/* global jest */

jest.mock("../../config", () => {
    const actualConfig = jest.requireActual("../../config");
    return {
        ...actualConfig,
        BASE_URL: "https://msteams-app.zeplin.io"
    };
});