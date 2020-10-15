interface ConfigurationCreateUrlParams {
    theme: string;
    channel: string;
}

interface ConfigurationUpdateUrlParams {
    theme: string;
    channel: string;
    id: string;
    resourceName: string;
    resourceType: string;
}

type UrlParams = ConfigurationCreateUrlParams | ConfigurationUpdateUrlParams;

class Url {
    getLoginUrl(params: UrlParams): string {
        return `/login?${new URLSearchParams(Object.entries(params))}`;
    }

    getConfigurationCreateUrl(params: ConfigurationCreateUrlParams): string {
        return `/configuration/create?${new URLSearchParams(Object.entries(params))}`;
    }

    getConfigurationUpdateUrl(params: ConfigurationUpdateUrlParams): string {
        return `/configuration/update?${new URLSearchParams(Object.entries(params))}`;
    }

    getHomeUrl(params: UrlParams): string {
        return `/?${new URLSearchParams(Object.entries(params))}`;
    }
}

export const url = new Url();
