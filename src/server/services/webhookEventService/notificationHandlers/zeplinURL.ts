import { BASE_URL, ZEPLIN_MAC_APP_URL_SCHEME, ZEPLIN_WEB_APP_BASE_URL } from "../../../config";

const REFERER_PARAM_NAME = "ref";
const REFERER_PARAM_VALUE = "microsoft-teams";

export function getWebAppURL(
    pathname: string,
    searchParams: { [key: string]: string | string[] } = {}
): string {
    const webappURL = new URL(ZEPLIN_WEB_APP_BASE_URL);

    webappURL.pathname = pathname;

    Object.entries(searchParams).forEach(([name, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => webappURL.searchParams.append(name, v));
        } else {
            webappURL.searchParams.set(name, value);
        }
    });

    webappURL.searchParams.set(REFERER_PARAM_NAME, REFERER_PARAM_VALUE);

    return webappURL.toString();
}

export function getRedirectURLForMacApp(
    resource: string,
    searchParams: { [key: string]: string | string[] } = {}
): string {
    let macAppURI = `${ZEPLIN_MAC_APP_URL_SCHEME}://${resource}`;
    macAppURI += `?${Object.entries(searchParams).map(
        ([name, value]) => {
            if (Array.isArray(value)) {
                return `${name}=${value.join(",")}`;
            }

            return `${name}=${value}`;
        }
    ).join("&")}`;

    macAppURI += `&${REFERER_PARAM_NAME}=${REFERER_PARAM_VALUE}`;

    const redirectURL = new URL(BASE_URL);
    redirectURL.pathname = "api/app-redirect";
    redirectURL.searchParams.set("uri", macAppURI);

    return redirectURL.toString();
}

