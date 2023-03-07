import { BASE_URL, ZEPLIN_APP_URI_SCHEME, ZEPLIN_WEB_APP_BASE_URL } from "../../../config";

const REFERER_PARAM_NAME = "ref";
const REFERER_PARAM_VALUE = "microsoft-teams";
const UTM_SOURCE = "utm_source";
const UTM_SOURCE_VALUE = "zeplin";
const UTM_MEDIUM = "utm_medium";
const UTM_MEDIUM_VALUE = "teams_integration";
const UTM_CAMPAIGN = "utm_campaign";

export function getWebAppURL(
    pathname: string,
    searchParams: { [key: string]: string | string[] } = {},
    utmParams: { [key: string]: string } = {}
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

    if (utmParams && utmParams.utmCampaign) {
        webappURL.searchParams.append(UTM_SOURCE, UTM_SOURCE_VALUE);
        webappURL.searchParams.append(UTM_MEDIUM, UTM_MEDIUM_VALUE);
        webappURL.searchParams.append(UTM_CAMPAIGN, utmParams.utmCampaign);
    }

    return webappURL.toString();
}

export function getRedirectURLForZeplinApp(
    resource: string,
    searchParams: { [key: string]: string | string[] } = {},
    utmParams: { [key: string]: string | string[] } = {}
): string {
    let appURI = `${ZEPLIN_APP_URI_SCHEME}://${resource}`;
    appURI += `?${Object.entries(searchParams).map(
        ([name, value]) => {
            if (Array.isArray(value)) {
                return `${name}=${value.join(",")}`;
            }

            return `${name}=${value}`;
        }
    ).join("&")}`;

    appURI += `&${REFERER_PARAM_NAME}=${REFERER_PARAM_VALUE}`;
    if (utmParams && utmParams.utmCampaign) {
        appURI += `&${UTM_SOURCE}=${UTM_SOURCE_VALUE}`;
        appURI += `&${UTM_MEDIUM}=${UTM_MEDIUM_VALUE}`;
        appURI += `&${UTM_CAMPAIGN}=${utmParams.utmCampaign}`;
    }

    const redirectURL = new URL(BASE_URL);
    redirectURL.pathname = "zeplin/app-redirect";
    redirectURL.searchParams.set("uri", appURI);

    return redirectURL.toString();
}