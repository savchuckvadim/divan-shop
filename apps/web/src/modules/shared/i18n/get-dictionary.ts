import type { Locale } from "@/modules/shared/config";

import { CATALOG, COMMON, FORM, NOT_FOUND, PRODUCT, SEO } from "./dictionaries";

export const getDictionary = (locale: Locale) => ({
    common: COMMON[locale],
    catalog: CATALOG[locale],
    product: PRODUCT[locale],
    form: FORM[locale],
    seo: SEO[locale],
    notFound: NOT_FOUND[locale],
});

export type Dictionary = ReturnType<typeof getDictionary>;
