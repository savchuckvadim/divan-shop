import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AccountPage, generateAccountPageMetadata } from "@/modules/pages";
import { isLocale } from "@/modules/shared/config";

interface AccountRouteProps {
    params: Promise<{ locale: string }>;
}

export default async function AccountRoute({ params }: AccountRouteProps) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return <AccountPage locale={locale} />;
}

export const generateMetadata = async ({ params }: AccountRouteProps): Promise<Metadata> => {
    const { locale } = await params;
    if (!isLocale(locale)) return {};

    return generateAccountPageMetadata({ locale });
};
