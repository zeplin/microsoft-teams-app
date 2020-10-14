class Url {
    get login(): string {
        const loginUrl = new URL(window.location.href);
        loginUrl.pathname = "/login";
        return loginUrl.toString();
    }

    get configurationCreate(): string {
        const loginUrl = new URL(window.location.href);
        loginUrl.pathname = "/configuration/create";
        return loginUrl.toString();
    }

    get configurationUpdate(): string {
        const loginUrl = new URL(window.location.href);
        loginUrl.pathname = "/configuration/create";
        return loginUrl.toString();
    }
}

export const url = new Url();
