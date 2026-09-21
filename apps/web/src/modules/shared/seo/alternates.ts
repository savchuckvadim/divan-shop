import type { Metadata } from "next";

import { DEFAULT_LOCALE, type Locale, LOCALES } from "@/modules/shared/config";
import { absoluteUrl } from "@/modules/shared/lib";

export type PathForLocale = (locale: Locale) => string;

export const buildAlternates = (
    currentLocale: Locale,
    pathFor: PathForLocale
): NonNullable<Metadata["alternates"]> => ({
    canonical: absoluteUrl(pathFor(currentLocale)),
    languages: {
        ...Object.fromEntries(LOCALES.map((locale) => [locale, absoluteUrl(pathFor(locale))])),
        "x-default": absoluteUrl(pathFor(DEFAULT_LOCALE)),
    },
});
