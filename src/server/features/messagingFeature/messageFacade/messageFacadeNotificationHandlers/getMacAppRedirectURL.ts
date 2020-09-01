import { BASE_URL } from "../../../../config";

export function getMacAppRedirectURL(macAppURI: string): string {
    return `${BASE_URL}/api/app-redirect?uri=${encodeURIComponent(macAppURI)}`;
}