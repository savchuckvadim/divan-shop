import { unstable_cache } from "next/cache";

import type { DataFromGlobalSlug } from "payload";

import { CMS_CACHE_SECONDS, DEFAULT_LOCALE, type Locale } from "@/modules/shared/config";
import type { Config } from "@/payload-types";

import { getPayloadClient } from "./payload-client";

type GlobalSlug = keyof Config["globals"];

export const globalCacheTag = (slug: GlobalSlug): string => `global_${slug}`;

const getGlobal = async <T extends GlobalSlug>(
    slug: T,
    locale: Locale,
    depth: number
): Promise<DataFromGlobalSlug<T>> => {
    const payload = await getPayloadClient();
    return payload.findGlobal({ slug, depth, locale, fallbackLocale: DEFAULT_LOCALE });
};

export const getCachedGlobal = <T extends GlobalSlug>(slug: T, locale: Locale, depth = 1) =>
    unstable_cache(() => getGlobal(slug, locale, depth), [slug, locale, String(depth)], {
        tags: [globalCacheTag(slug)],
        revalidate: CMS_CACHE_SECONDS,
    });
