import { DEFAULT_LOCALE, isLocale, type Locale } from "@/modules/shared/config";

export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const readText = (formData: FormData, key: string, maxLength = 255): string =>
    String(formData.get(key) ?? "")
        .trim()
        .slice(0, maxLength);

export const readLocale = (formData: FormData): Locale => {
    const value = formData.get("locale");
    return isLocale(value) ? value : DEFAULT_LOCALE;
};

export const readEmail = (formData: FormData): string => readText(formData, "email").toLowerCase();

export const isChecked = (formData: FormData, key: string): boolean => {
    const value = formData.get(key);
    return value === "on" || value === "true";
};

export const isValidEmail = (value: string): boolean => EMAIL_PATTERN.test(value);
