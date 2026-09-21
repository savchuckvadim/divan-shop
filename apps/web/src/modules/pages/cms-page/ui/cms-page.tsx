import type { Metadata } from "next";
import { draftMode } from "next/headers";

import { getPageBySlug, isHomeSlug } from "@/modules/entities";
import { type Locale, ROUTES, SITE } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { generateMeta } from "@/modules/shared/seo";
import { LivePreviewListener } from "@/modules/shared/ui";
import { PayloadRedirects } from "@/modules/shared/ui/payload-redirects";
import { RenderBlocks, RenderHero } from "@/modules/widgets";

import { HomeFallback } from "./home-fallback";

interface CmsPageProps {
    locale: Locale;
    slug?: string;
}

export const CmsPage = async ({ locale, slug = SITE.homeSlug }: CmsPageProps) => {
    const { isEnabled: draft } = await draftMode();
    const page = await getPageBySlug(slug, locale, draft);
    const url = isHomeSlug(slug) ? "/" : `/${slug}`;

    if (!page && isHomeSlug(slug)) {
        return <HomeFallback locale={locale} />;
    }

    if (!page) {
        return <PayloadRedirects url={url} locale={locale} />;
    }

    return (
        <article className="pb-16 md:pb-24">
            <PayloadRedirects disableNotFound url={url} locale={locale} />
            {draft && <LivePreviewListener />}
            <RenderHero {...page.hero} locale={locale} />
            <RenderBlocks blocks={page.layout} locale={locale} />
        </article>
    );
};

export const generateCmsPageMetadata = async ({
    locale,
    slug = SITE.homeSlug,
}: CmsPageProps): Promise<Metadata> => {
    const { isEnabled: draft } = await draftMode();
    const page = await getPageBySlug(slug, locale, draft);
    const { seo } = getDictionary(locale);

    return generateMeta({
        locale,
        pathFor: (l) => ROUTES.page(l, slug),
        meta: page?.meta,
        fallbackTitle: page?.title ?? seo.defaultTitle,
        fallbackDescription: seo.defaultDescription,
        applyTemplate: Boolean(page?.meta?.title || page?.title),
    });
};
