export const LOCALES = ["ru", "en", "es", "uk"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ru";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALE_HEADER = "x-locale";

export const isLocale = (value: unknown): value is Locale =>
    typeof value === "string" && (LOCALES as readonly string[]).includes(value);

export const LOCALE_LABELS: Record<Locale, string> = {
    ru: "Русский",
    en: "English",
    es: "Español",
    uk: "Українська",
};

/**
 * Short switcher labels. Ukrainian shows "UA" as people in Ukraine expect, while the
 * language code stays ISO 639-1 `uk` everywhere it matters (URLs, html lang, hreflang).
 */
export const LOCALE_SHORT: Record<Locale, string> = {
    ru: "RU",
    en: "EN",
    es: "ES",
    uk: "UA",
};

export const LOCALE_OG: Record<Locale, string> = {
    ru: "ru_RU",
    en: "en_US",
    es: "es_ES",
    uk: "uk_UA",
};

export const LOCALE_INTL: Record<Locale, string> = {
    ru: "ru-RU",
    en: "en-US",
    es: "es-ES",
    uk: "uk-UA",
};
