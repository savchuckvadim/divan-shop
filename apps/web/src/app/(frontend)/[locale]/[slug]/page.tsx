import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPageSlugs, isHomeSlug } from "@/modules/entities";
import { CmsPage, generateCmsPageMetadata } from "@/modules/pages";
import { isLocale, LOCALES } from "@/modules/shared/config";
import { safeStaticParams } from "@/modules/shared/lib";

interface PageRouteProps {
    params: Promise<{ locale: string; slug: string }>;
}

export const generateStaticParams = () =>
    safeStaticParams(async () => {
        const slugs = await getPageSlugs();
        return LOCALES.flatMap((locale) =>
            slugs.filter(({ slug }) => !isHomeSlug(slug)).map(({ slug }) => ({ locale, slug }))
        );
    });

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
