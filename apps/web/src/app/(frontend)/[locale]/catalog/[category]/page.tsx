import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogPage, generateCatalogPageMetadata } from "@/modules/pages";
import { isLocale } from "@/modules/shared/config";

/**
 * Rendered on demand and cached: the Docker image is built without a database
 * (see docs/HISTORY.md). Payload hooks call revalidatePath on publish.
 */
export const dynamic = "force-dynamic";

interface CategoryRouteProps {
    params: Promise<{ locale: string; category: string }>;
    searchParams: Promise<{ page?: string }>;
}

const parsePage = (value?: string): number => Math.max(1, Number.parseInt(value ?? "1", 10) || 1);

export default async function CategoryRoute({ params, searchParams }: CategoryRouteProps) {
    const [{ locale, category }, { page }] = await Promise.all([params, searchParams]);
    if (!isLocale(locale)) notFound();

    return (
        <CatalogPage
            locale={locale}
            categorySlug={decodeURIComponent(category)}
            page={parsePage(page)}
        />
    );
}

export const generateMetadata = async ({
    params,
    searchParams,
}: CategoryRouteProps): Promise<Metadata> => {
    const [{ locale, category }, { page }] = await Promise.all([params, searchParams]);
    if (!isLocale(locale)) return {};

    return generateCatalogPageMetadata({
        locale,
        categorySlug: decodeURIComponent(category),
        page: parsePage(page),
    });
};
