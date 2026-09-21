import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CmsPage, generateCmsPageMetadata } from "@/modules/pages";
import { isLocale } from "@/modules/shared/config";

interface HomeRouteProps {
    params: Promise<{ locale: string }>;
}

export default async function HomeRoute({ params }: HomeRouteProps) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return <CmsPage locale={locale} />;
}

export const generateMetadata = async ({ params }: HomeRouteProps): Promise<Metadata> => {
    const { locale } = await params;
    if (!isLocale(locale)) return {};

    return generateCmsPageMetadata({ locale });
};
