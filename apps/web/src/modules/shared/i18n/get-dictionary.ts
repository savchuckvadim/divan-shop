import type { Locale } from "@/modules/shared/config";

import { ACCOUNT, BLOG, CATALOG, COMMON, FORM, NOT_FOUND, PRODUCT, SEO } from "./dictionaries";

export const getDictionary = (locale: Locale) => ({
    common: COMMON[locale],
    catalog: CATALOG[locale],
    product: PRODUCT[locale],
    form: FORM[locale],
    seo: SEO[locale],
    notFound: NOT_FOUND[locale],
    blog: BLOG[locale],
    account: ACCOUNT[locale],
});

export type Dictionary = ReturnType<typeof getDictionary>;
