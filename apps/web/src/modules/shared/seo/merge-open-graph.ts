import type { Metadata } from "next";

import { type Locale, LOCALE_OG, SITE } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export interface OgImageArgs {
    url: string;
    alt: string;
}

export const ogImage = ({ url, alt }: OgImageArgs) => ({
    url,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt,
});

/**
 * `images` is deliberately left to the caller: when it stays undefined, Next fills
 * `og:image` from the route's generated `opengraph-image.tsx` (hashed URL, so it
 * cannot be constructed by hand).
 */
export const mergeOpenGraph = (
    locale: Locale,
    og?: Metadata["openGraph"]
): Metadata["openGraph"] => {
    const { seo } = getDictionary(locale);

    return {
        type: "website",
        siteName: SITE.name,
        locale: LOCALE_OG[locale],
        title: seo.defaultTitle,
        description: seo.defaultDescription,
        ...og,
    };
};

/** `twitter.site` / `creator` are only emitted once a handle is configured. */
export const mergeTwitter = (title: string, description: string): Metadata["twitter"] => {
    const handle = SITE.twitterHandle.trim();

    return {
        card: "summary_large_image",
        title,
        description,
        ...(handle ? { site: handle, creator: handle } : {}),
    };
};
