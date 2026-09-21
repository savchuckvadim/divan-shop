import { BRAND_NAME, type Currency, type Locale } from "@/modules/shared/config";

export type Localized<T> = Record<Locale, T>;

export const SITE_SEED = {
    siteName: BRAND_NAME,
    currency: "EUR" as Currency,
    phone: "+34 600 000 000",
    email: "hola@divan-shop.es",
    address: {
        es: "Alicante",
        en: "Alicante",
        ru: "Аликанте",
        uk: "Аліканте",
    } satisfies Localized<string>,
    workingHours: {
        es: "Lun–Sáb 10:00–20:00",
        en: "Mon–Sat 10:00–20:00",
        ru: "Пн–Сб 10:00–20:00",
        uk: "Пн–Сб 10:00–20:00",
    } satisfies Localized<string>,
};

export const NAV_LABELS = {
    about: {
        es: "Sobre nosotros",
        en: "About us",
        ru: "О нас",
        uk: "Про нас",
    },
    contacts: {
        es: "Contacto",
        en: "Contacts",
        ru: "Контакты",
        uk: "Контакти",
    },
} satisfies Record<string, Localized<string>>;
