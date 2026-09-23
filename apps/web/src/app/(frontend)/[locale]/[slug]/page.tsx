import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CmsPage, generateCmsPageMetadata } from "@/modules/pages";
import { isLocale } from "@/modules/shared/config";

/**
 * Rendered on demand and cached: the Docker image is built without a database
 * (see docs/HISTORY.md). Payload hooks call revalidatePath on publish.
 */
export const dynamic = "force-dynamic";

interface PageRouteProps {
    params: Promise<{ locale: string; slug: string }>;
}

export default async function PageRoute({ params }: PageRouteProps) {
    const { locale, slug } = await params;
    if (!isLocale(locale)) notFound();

    return <CmsPage locale={locale} slug={decodeURIComponent(slug)} />;
}

export const generateMetadata = async ({ params }: PageRouteProps): Promise<Metadata> => {
    const { locale, slug } = await params;
    if (!isLocale(locale)) return {};

    return generateCmsPageMetadata({ locale, slug: decodeURIComponent(slug) });
};
