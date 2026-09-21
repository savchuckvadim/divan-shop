import { getCachedGlobal } from "@/modules/shared/api";
import { type Currency, DEFAULT_CURRENCY, type Locale } from "@/modules/shared/config";
import type { SiteSetting } from "@/payload-types";

export const getSiteSettings = (locale: Locale): Promise<SiteSetting> =>
    getCachedGlobal("site-settings", locale, 1)();

export const getCurrency = (settings: SiteSetting | null | undefined): Currency =>
    (settings?.currency as Currency | undefined) ?? DEFAULT_CURRENCY;
