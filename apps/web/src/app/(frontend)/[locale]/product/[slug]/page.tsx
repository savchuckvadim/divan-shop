import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { generateProductPageMetadata, ProductPage } from "@/modules/pages";
import { isLocale } from "@/modules/shared/config";

/**
 * Rendered on demand and cached: the Docker image is built without a database
 * (see docs/HISTORY.md). Payload hooks call revalidatePath on publish.
 */
export const dynamic = "force-dynamic";

interface ProductRouteProps {
    params: Promise<{ locale: string; slug: string }>;
}

export default async function ProductRoute({ params }: ProductRouteProps) {
    const { locale, slug } = await params;
    if (!isLocale(locale)) notFound();

    return <ProductPage locale={locale} slug={decodeURIComponent(slug)} />;
}

export const generateMetadata = async ({ params }: ProductRouteProps): Promise<Metadata> => {
    const { locale, slug } = await params;
    if (!isLocale(locale)) return {};

    return generateProductPageMetadata({ locale, slug: decodeURIComponent(slug) });
};
