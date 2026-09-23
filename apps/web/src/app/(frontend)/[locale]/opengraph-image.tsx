import { DEFAULT_LOCALE, isLocale } from "@/modules/shared/config";
import {
    OG_CONTENT_TYPE,
    OG_SIZE,
    ogImageAlt,
    renderOgImage,
    siteOgCard,
} from "@/modules/shared/seo/og";

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

export default async function SiteOgImage({ params }: OgRouteProps) {
    const { locale } = await params;
    const safeLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;

    return renderOgImage(safeLocale, () => siteOgCard(safeLocale));
}
