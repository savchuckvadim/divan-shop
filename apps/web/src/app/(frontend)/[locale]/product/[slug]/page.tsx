import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProductSlugs } from "@/modules/entities";
import { generateProductPageMetadata, ProductPage } from "@/modules/pages";
import { isLocale, LOCALES } from "@/modules/shared/config";

interface ProductRouteProps {
    params: Promise<{ locale: string; slug: string }>;
}

export const generateStaticParams = async () => {
    const slugs = await getProductSlugs();
    return LOCALES.flatMap((locale) => slugs.map(({ slug }) => ({ locale, slug })));
};

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
