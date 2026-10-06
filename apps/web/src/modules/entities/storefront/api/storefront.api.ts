import { unstable_cache } from "next/cache";

import { getPayloadClient } from "@/modules/shared/api";
import {
    CMS_CACHE_SECONDS,
    DEFAULT_LOCALE,
    type Locale,
    STOREFRONT,
    STOREFRONTS_CACHE_TAG,
} from "@/modules/shared/config";
import type { SiteSetting, Storefront } from "@/payload-types";

const findStorefront = async (locale: Locale): Promise<Storefront | null> => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
        collection: "storefronts",
        where: { key: { equals: STOREFRONT } },
        locale,
        fallbackLocale: DEFAULT_LOCALE,
        depth: 1,
        limit: 1,
        pagination: false,
    });
    return docs[0] ?? null;
};

/** CMS content of the storefront this build serves (NEXT_PUBLIC_STOREFRONT); null until it exists. */
export const getStorefrontContent = (locale: Locale): Promise<Storefront | null> =>
    unstable_cache(() => findStorefront(locale), ["storefront", STOREFRONT, locale], {
        tags: [STOREFRONTS_CACHE_TAG],
        revalidate: CMS_CACHE_SECONDS,
    })();

/** The storefront's own phone and email when set, Site Settings otherwise. */
export const resolveContacts = (settings: SiteSetting, storefront: Storefront | null) => ({
    ...settings.contacts,
    phone: storefront?.contacts?.phone || settings.contacts?.phone,
    email: storefront?.contacts?.email || settings.contacts?.email,
});
