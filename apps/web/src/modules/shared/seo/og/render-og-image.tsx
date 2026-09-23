import { ImageResponse } from "next/og";

import { type Locale, SITE } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";

import { OgCard, type OgCardProps } from "./og-card";
import { OG_SIZE } from "./og-theme";

/** Site-level card: brand wordmark, tagline and city line. Also the fallback for every route. */
export const siteOgCard = (locale: Locale): OgCardProps => {
    const { common } = getDictionary(locale);

    return {
        eyebrow: common.cityLine,
        title: common.siteName || SITE.name,
        subtitle: common.tagline,
        brandName: common.siteName || SITE.name,
        cityLine: common.cityLine,
    };
};

export const ogImageAlt = (locale: Locale): string => getDictionary(locale).og.imageAlt;

type CardBuilder = () => OgCardProps | Promise<OgCardProps>;

/**
 * Renders an OG card, falling back to the site-level design when the document is
 * missing or the database is unreachable, so the route never throws.
 */
export const renderOgImage = async (locale: Locale, build: CardBuilder): Promise<ImageResponse> => {
    let card: OgCardProps;

    try {
        card = await build();
    } catch {
        card = siteOgCard(locale);
    }

    return new ImageResponse(<OgCard {...card} />, OG_SIZE);
};
