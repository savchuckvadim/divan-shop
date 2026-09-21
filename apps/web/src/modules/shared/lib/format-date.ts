import { type Locale, LOCALE_INTL } from "@/modules/shared/config";

export const formatDate = (value: string | Date, locale: Locale): string =>
    new Intl.DateTimeFormat(LOCALE_INTL[locale], { dateStyle: "long" }).format(new Date(value));
