import { useRouter } from "next/router";
import React, { FunctionComponent, useEffect, useState } from "react";
import { ZeplinAppRedirect } from "./components";
import * as config from "../../lib/config";

const SUPPORT_ARTICLE_URL = "https://support.zeplin.io/en/articles/244698-downloading-mac-and-windows-apps";
const MACOS_DOWNLOAD_URL = "https://zpl.io/download-mac";
const WINDOWS_DOWNLOAD_URL = "https://zpl.io/download-windows-64";

enum OS {
    IOS = "ios",
    ANDROID = "android",
    MACOS = "macos",
    WINDOWS = "win",
    LINUX = "linux",
    UNKNOWN = "unknown"
}

function getOSType(userAgent: string): OS {
    if (/iPad|iPhone/.test(userAgent)) {
        return OS.IOS;
    }

    if (/Android/.test(userAgent)) {
        return OS.ANDROID;
    }

    if (/Macintosh/.test(userAgent)) {
        return OS.MACOS;
    }

    if (/Windows/.test(userAgent)) {
        return OS.WINDOWS;
    }

    if (/Linux/.test(userAgent) || /X11/.test(userAgent)) {
        return OS.LINUX;
    }

    return OS.UNKNOWN;
}

function useOSType(): string | undefined {
    const [osType, setOSType] = useState<string | undefined>();

    useEffect(() => {
        setOSType(getOSType(navigator.userAgent));
    }, []);

    return osType;
}

function useAppURI(): string | undefined {
    const { query: { uri } } = useRouter();

    if (typeof uri !== "string") {
        return;
    }

    try {
        const appURI = new URL(uri);

        if (appURI.protocol !== `${config.ZEPLIN_APP_URI_SCHEME}:`) {
            return;
        }

        return uri;
    } catch (error) {
        // Nop
    }
}

export const ZeplinAppRedirectContainer: FunctionComponent = () => {
    const osType = useOSType();
    const appURI = useAppURI();

    useEffect(() => {
        if (appURI) {
            location.assign(appURI);
        }
    }, []);

    let downloadLink;
    switch (osType) {
        case OS.MACOS:
            downloadLink = MACOS_DOWNLOAD_URL;
            break;
        case OS.WINDOWS:
            downloadLink = WINDOWS_DOWNLOAD_URL;
            break;
        default:
            downloadLink = SUPPORT_ARTICLE_URL;
            break;
    }

    return <ZeplinAppRedirect downloadLink={downloadLink}/>;
};
