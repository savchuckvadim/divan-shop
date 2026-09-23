import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { generateLoginPageMetadata, LoginPage } from "@/modules/pages";
import { isLocale } from "@/modules/shared/config";

/**
 * Reads the customer session, so it must never be prerendered: the build has no
 * database and no cookies (see docs/HISTORY.md).
 */
export const dynamic = "force-dynamic";

interface LoginRouteProps {
    params: Promise<{ locale: string }>;
}

export default async function LoginRoute({ params }: LoginRouteProps) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return <LoginPage locale={locale} />;
}

export const generateMetadata = async ({ params }: LoginRouteProps): Promise<Metadata> => {
    const { locale } = await params;
    if (!isLocale(locale)) return {};

    return generateLoginPageMetadata({ locale });
};
