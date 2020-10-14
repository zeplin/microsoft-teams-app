class Url {
    get login(): string {
        return `/login?${window.location.search}`;
    }

    get configurationCreate(): string {
        return `/configuration/create?${window.location.search}`;
    }

    get configurationUpdate(): string {
        return `/configuration/update?${window.location.search}`;
    }
}

export const url = new Url();
