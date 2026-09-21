import type { Metadata } from "next";

import { type Locale, LOCALE_OG, SITE } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { absoluteUrl } from "@/modules/shared/lib";

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
        images: og?.images ?? [{ url: absoluteUrl(SITE.defaultOgImage) }],
    };
};
