import type { Metadata } from "next";

import { type Locale, SITE } from "@/modules/shared/config";
import { getDictionary, interpolate } from "@/modules/shared/i18n";
import { absoluteUrl, isPopulated } from "@/modules/shared/lib";
import type { Media } from "@/payload-types";

import { buildAlternates, type PathForLocale } from "./alternates";
import { mergeOpenGraph } from "./merge-open-graph";

export interface SeoMeta {
    title?: string | null;
    description?: string | null;
    image?: Media | string | number | null;
}

interface GenerateMetaArgs {
    locale: Locale;
    pathFor: PathForLocale;
    meta?: SeoMeta | null;
    fallbackTitle: string;
    fallbackDescription?: string;
    noIndex?: boolean;
    applyTemplate?: boolean;
}

export const getOgImageUrl = (image?: Media | string | number | null): string => {
    if (isPopulated(image) && image.url) {
        return absoluteUrl(image.sizes?.og?.url || image.url);
    }
    return absoluteUrl(SITE.defaultOgImage);
};

export const generateMeta = ({
    locale,
    pathFor,
    meta,
    fallbackTitle,
    fallbackDescription,
    noIndex,
    applyTemplate = true,
}: GenerateMetaArgs): Metadata => {
    const { seo } = getDictionary(locale);
    const rawTitle = meta?.title || fallbackTitle;
    const title = applyTemplate ? interpolate(seo.titleTemplate, { title: rawTitle }) : rawTitle;
    const description = meta?.description || fallbackDescription || seo.defaultDescription;
    const alternates = buildAlternates(locale, pathFor);

    return {
        title,
        description,
        alternates,
        robots: noIndex ? { index: false, follow: false } : undefined,
        openGraph: mergeOpenGraph(locale, {
            title,
            description,
            url: alternates.canonical as string,
            images: [{ url: getOgImageUrl(meta?.image) }],
        }),
    };
};
