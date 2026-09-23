import {
    getCurrency,
    getProductBySlug,
    getProductCategory,
    getSiteSettings,
} from "@/modules/entities";
import { DEFAULT_LOCALE, isLocale, SITE } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { formatPrice } from "@/modules/shared/lib";
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
    params: Promise<{ locale: string; slug: string }>;
}

export const generateImageMetadata = async ({ params }: OgRouteProps) => {
    const { locale } = await params;
    const safeLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;

    return [{ id: "default", size, contentType, alt: ogImageAlt(safeLocale) }];
};

export default async function ProductOgImage({ params }: OgRouteProps) {
    const { locale, slug } = await params;
    const safeLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;

    return renderOgImage(safeLocale, async () => {
        const [product, settings] = await Promise.all([
            getProductBySlug(decodeURIComponent(slug), safeLocale),
            getSiteSettings(safeLocale),
        ]);

        if (!product) return siteOgCard(safeLocale);

        const { common, catalog } = getDictionary(safeLocale);
        const brandName = settings.siteName || common.siteName || SITE.name;

        return {
            eyebrow: getProductCategory(product)?.title || catalog.title,
            title: product.title,
            subtitle: product.meta?.description || common.tagline,
            price: formatPrice(product.price, getCurrency(settings), safeLocale),
            brandName,
            cityLine: common.cityLine,
        };
    });
}
