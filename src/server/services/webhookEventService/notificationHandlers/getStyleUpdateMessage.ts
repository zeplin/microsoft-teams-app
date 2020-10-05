import { ProjectPlatform, StyleguidePlatform } from "../../../adapters/zeplin/types";

export function getColorUpdateMessage(platform: ProjectPlatform | StyleguidePlatform): string {
    switch (platform) {
        case ProjectPlatform.WEB:
        case StyleguidePlatform.WEB:
            return "Make sure your stylesheets are up to date!";
        case ProjectPlatform.IOS:
        case StyleguidePlatform.IOS:
            return "Make sure `UIColor` category / extension is up to date!";
        case ProjectPlatform.MAC_OS:
        case StyleguidePlatform.MAC_OS:
            return "Make sure `NSColor` category / extension is up to date!";
        case ProjectPlatform.ANDROID:
        case StyleguidePlatform.ANDROID:
            return "Make sure `colors.xml` is up to date!";
        default:
            return "Make sure your styles are up to date!";
    }
}

export function getTextStyleUpdateMessage(platform: ProjectPlatform | StyleguidePlatform): string {
    switch (platform) {
        case ProjectPlatform.WEB:
        case StyleguidePlatform.WEB:
            return "Make sure your stylesheets are up to date!";
        case ProjectPlatform.IOS:
        case StyleguidePlatform.IOS:
            return "Make sure `UIFont` category / extension is up to date!";
        case ProjectPlatform.MAC_OS:
        case StyleguidePlatform.MAC_OS:
            return "Make sure `NSFont` category / extension is up to date!";
        case ProjectPlatform.ANDROID:
        case StyleguidePlatform.ANDROID:
            return "Make sure `fonts.xml` is up to date!";
        default:
            return "Make sure your styles are up to date!";
    }
}

export function getSpacingTokenUpdateMessage(platform: ProjectPlatform | StyleguidePlatform): string {
    switch (platform) {
        case ProjectPlatform.ANDROID:
        case StyleguidePlatform.ANDROID:
            return "Make sure `spacing.xml` is up to date!";
        default:
            return "Make sure your tokens are up to date!";
    }
}