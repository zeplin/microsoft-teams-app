import { Project, Styleguide } from "@zeplin/sdk";

export function getColorUpdateMessage(platform: Project["platform"] | Styleguide["platform"]): string {
    switch (platform) {
        case "web":
            return "Make sure your stylesheets are up to date!";
        case "ios":
            return "Make sure `UIColor` category / extension is up to date!";
        case "macos":
            return "Make sure `NSColor` category / extension is up to date!";
        case "android":
            return "Make sure `colors.xml` is up to date!";
        case "base":
        default:
            return "Make sure your styles are up to date!";
    }
}

export function getTextStyleUpdateMessage(platform: Project["platform"] | Styleguide["platform"]): string {
    switch (platform) {
        case "web":
            return "Make sure your stylesheets are up to date!";
        case "ios":
            return "Make sure `UIFont` category / extension is up to date!";
        case "macos":
            return "Make sure `NSFont` category / extension is up to date!";
        case "android":
            return "Make sure `fonts.xml` is up to date!";
        case "base":
        default:
            return "Make sure your styles are up to date!";
    }
}

export function getSpacingTokenUpdateMessage(platform: Project["platform"] | Styleguide["platform"]): string {
    switch (platform) {
        case "android":
            return "Make sure `spacing.xml` is up to date!";
        case "web":
        case "ios":
        case "macos":
        case "base":
        default:
            return "Make sure your tokens are up to date!";
    }
}
