import type { Locale } from "./locales";
import { SITE } from "./site";

export const ROUTES = {
    home: (locale: Locale) => `/${locale}`,
    page: (locale: Locale, slug: string) =>
        slug === SITE.homeSlug ? `/${locale}` : `/${locale}/${slug}`,
    catalog: (locale: Locale) => `/${locale}/catalog`,
    category: (locale: Locale, slug: string) => `/${locale}/catalog/${slug}`,
    product: (locale: Locale, slug: string) => `/${locale}/product/${slug}`,
    account: (locale: Locale) => `/${locale}/account`,
    login: (locale: Locale) => `/${locale}/account/login`,
    register: (locale: Locale) => `/${locale}/account/register`,
} as const;

export type RouteKey = keyof typeof ROUTES;

export const stripLocale = (pathname: string): string => {
    const [, first, ...rest] = pathname.split("/");
    if (!first) return "/";
    return `/${rest.join("/")}`.replace(/\/+$/, "") || "/";
};

export const withLocale = (locale: Locale, pathWithoutLocale: string): string => {
    const normalized = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
    return `/${locale}${normalized}`;
};
