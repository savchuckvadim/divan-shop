import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { generateRegisterPageMetadata, RegisterPage } from "@/modules/pages";
import { isLocale } from "@/modules/shared/config";

/**
 * Reads the customer session, so it must never be prerendered: the build has no
 * database and no cookies (see docs/HISTORY.md).
 */
export const dynamic = "force-dynamic";

interface RegisterRouteProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ from?: string }>;
}

export default async function RegisterRoute({ params, searchParams }: RegisterRouteProps) {
    const [{ locale }, { from }] = await Promise.all([params, searchParams]);
    if (!isLocale(locale)) notFound();

    return <RegisterPage locale={locale} source={from} />;
}

export const generateMetadata = async ({ params }: RegisterRouteProps): Promise<Metadata> => {
    const { locale } = await params;
    if (!isLocale(locale)) return {};

    return generateRegisterPageMetadata({ locale });
};
