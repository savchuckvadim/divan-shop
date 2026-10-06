import type { Metadata } from "next";

import { type Locale, SITE, STOREFRONT_INDEXED } from "@/modules/shared/config";
import { getDictionary, interpolate } from "@/modules/shared/i18n";
import { absoluteUrl, isPopulated } from "@/modules/shared/lib";
import type { Media } from "@/payload-types";

import { buildAlternates, type PathForLocale } from "./alternates";
import { mergeOpenGraph, mergeTwitter, ogImage } from "./merge-open-graph";

export interface SeoMeta {
    title?: string | null;
    description?: string | null;
    image?: Media | string | number | null;
}

export interface ArticleMeta {
    publishedTime?: string | null;
    modifiedTime?: string | null;
    authors?: (string | null | undefined)[];
}

export interface ProductMeta {
    price: number;
    currency: string;
    availability?: string | null;
}

interface GenerateMetaArgs {
    locale: Locale;
    pathFor: PathForLocale;
    meta?: SeoMeta | null;
    fallbackTitle: string;
    fallbackDescription?: string;
    noIndex?: boolean;
    applyTemplate?: boolean;
    /** Emits `og:type=article` with publication dates and authors. */
    article?: ArticleMeta;
    /** Emits `product:price:*` meta alongside the default `og:type=website`. */
    product?: ProductMeta;
}

export const getOgImageUrl = (image?: Media | string | number | null): string | null => {
    if (isPopulated(image) && image.url) {
        return absoluteUrl(image.sizes?.og?.url || image.url);
    }
    return null;
};

export const generateMeta = ({
    locale,
    pathFor,
    meta,
    fallbackTitle,
    fallbackDescription,
    noIndex,
    applyTemplate = true,
    article,
    product,
}: GenerateMetaArgs): Metadata => {
    const { seo, og } = getDictionary(locale);
    const rawTitle = meta?.title || fallbackTitle;
    const title = applyTemplate ? interpolate(seo.titleTemplate, { title: rawTitle }) : rawTitle;
    const description = meta?.description || fallbackDescription || seo.defaultDescription;
    const alternates = buildAlternates(locale, pathFor);

    /**
     * An editor-uploaded OG image wins; otherwise `images` stays undefined so Next
     * injects the generated `opengraph-image.tsx` of this route (its URL is
     * content-hashed at build time and cannot be written by hand).
     */
    const uploadedImage = getOgImageUrl(meta?.image);
    const images = uploadedImage
        ? [ogImage({ url: uploadedImage, alt: meta?.title || rawTitle || og.imageAlt })]
        : undefined;

    const authors = article?.authors?.filter((author): author is string => Boolean(author));

    return {
        title,
        description,
        alternates,
        robots: noIndex || !STOREFRONT_INDEXED ? { index: false, follow: false } : undefined,
        twitter: mergeTwitter(title, description),
        openGraph: mergeOpenGraph(locale, {
            ...(article
                ? {
                      type: "article",
                      publishedTime: article.publishedTime ?? undefined,
                      modifiedTime: article.modifiedTime ?? undefined,
                      authors: authors?.length ? authors : [SITE.name],
                  }
                : { type: "website" }),
            title,
            description,
            url: alternates.canonical as string,
            ...(images ? { images } : {}),
        }),
        ...(product
            ? {
                  other: {
                      "product:price:amount": String(product.price),
                      "product:price:currency": product.currency,
                      ...(product.availability
                          ? { "product:availability": product.availability }
                          : {}),
                  },
              }
            : {}),
    };
};
