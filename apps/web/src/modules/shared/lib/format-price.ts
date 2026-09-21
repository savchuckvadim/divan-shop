import { type Currency, type Locale, LOCALE_INTL } from "@/modules/shared/config";

export const formatPrice = (amount: number, currency: Currency, locale: Locale): string =>
    new Intl.NumberFormat(LOCALE_INTL[locale], {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
