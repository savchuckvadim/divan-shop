import { getSiteSettings } from "@/modules/entities";
import { DEFAULT_LOCALE, isLocale, SITE } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { OG_CONTENT_TYPE, OG_SIZE, ogImageAlt, renderOgImage } from "@/modules/shared/seo/og";

/** Rendered on demand: the Docker image is built without a database (see docs/HISTORY.md). */
export const dynamic = "force-dynamic";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

interface OgRouteProps {
    params: Promise<{ locale: string }>;
}

export const generateImageMetadata = async ({ params }: OgRouteProps) => {
    const { locale } = await params;
    const safeLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;

    return [{ id: "default", size, contentType, alt: ogImageAlt(safeLocale) }];
};

export default async function CatalogOgImage({ params }: OgRouteProps) {
    const { locale } = await params;
    const safeLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;

    return renderOgImage(safeLocale, async () => {
        const settings = await getSiteSettings(safeLocale);
        const { common, og, catalog } = getDictionary(safeLocale);

        return {
            eyebrow: og.catalogEyebrow,
            title: catalog.title,
            subtitle: catalog.description,
            brandName: settings.siteName || common.siteName || SITE.name,
            cityLine: common.cityLine,
        };
    });
}
