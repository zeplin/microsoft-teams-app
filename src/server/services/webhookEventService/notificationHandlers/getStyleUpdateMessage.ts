import { ProjectPlatformEnum, StyleguidePlatformEnum } from "../../../enums";

export function getColorUpdateMessage(platform: ProjectPlatformEnum | StyleguidePlatformEnum): string {
    switch (platform) {
        case ProjectPlatformEnum.WEB:
        case StyleguidePlatformEnum.WEB:
            return "Make sure your stylesheets are up to date!";
        case ProjectPlatformEnum.IOS:
        case StyleguidePlatformEnum.IOS:
            return "Make sure `UIColor` category / extension is up to date!";
        case ProjectPlatformEnum.MAC_OS:
        case StyleguidePlatformEnum.MAC_OS:
            return "Make sure `NSColor` category / extension is up to date!";
        case ProjectPlatformEnum.ANDROID:
        case StyleguidePlatformEnum.ANDROID:
            return "Make sure `colors.xml` is up to date!";
        default:
            return "Make sure your styles are up to date!";
    }
}

export function getTextStyleUpdateMessage(platform: ProjectPlatformEnum | StyleguidePlatformEnum): string {
    switch (platform) {
        case ProjectPlatformEnum.WEB:
        case StyleguidePlatformEnum.WEB:
            return "Make sure your stylesheets are up to date!";
        case ProjectPlatformEnum.IOS:
        case StyleguidePlatformEnum.IOS:
            return "Make sure `UIFont` category / extension is up to date!";
        case ProjectPlatformEnum.MAC_OS:
        case StyleguidePlatformEnum.MAC_OS:
            return "Make sure `NSFont` category / extension is up to date!";
        case ProjectPlatformEnum.ANDROID:
        case StyleguidePlatformEnum.ANDROID:
            return "Make sure `fonts.xml` is up to date!";
        default:
            return "Make sure your styles are up to date!";
    }
}

export function getSpacingTokenUpdateMessage(platform: ProjectPlatformEnum | StyleguidePlatformEnum): string {
    switch (platform) {
        case ProjectPlatformEnum.ANDROID:
        case StyleguidePlatformEnum.ANDROID:
            return "Make sure `spacing.xml` is up to date!";
        default:
            return "Make sure your tokens are up to date!";
    }
}
