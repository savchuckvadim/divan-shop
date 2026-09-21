import type { Locale } from "./locales";
import { SITE } from "./site";

export const ROUTES = {
    home: (locale: Locale) => `/${locale}`,
    page: (locale: Locale, slug: string) =>
        slug === SITE.homeSlug ? `/${locale}` : `/${locale}/${slug}`,
    catalog: (locale: Locale) => `/${locale}/catalog`,
    category: (locale: Locale, slug: string) => `/${locale}/catalog/${slug}`,
    product: (locale: Locale, slug: string) => `/${locale}/product/${slug}`,
    blog: (locale: Locale) => `/${locale}/blog`,
    article: (locale: Locale, slug: string) => `/${locale}/blog/${slug}`,
    about: (locale: Locale) => `/${locale}/about`,
    contacts: (locale: Locale, productSlug?: string) =>
        productSlug
            ? `/${locale}/contacts?product=${encodeURIComponent(productSlug)}#form`
            : `/${locale}/contacts`,
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
