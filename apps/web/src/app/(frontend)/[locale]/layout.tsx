import type { ReactNode } from "react";

import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { fontVariables } from "@storefront/fonts";

import { themeAttributes } from "@workspace/themes/presets";

import { getSiteSettings, getStorefrontContent, resolveContacts } from "@/modules/entities";
import {
    isLocale,
    LOCALES,
    SITE,
    STOREFRONT,
    STOREFRONT_INDEXED,
    STOREFRONT_PRESET,
} from "@/modules/shared/config";
import { getDictionary, I18nProvider } from "@/modules/shared/i18n";
import { getServerSideURL } from "@/modules/shared/lib";
import { JsonLd, organizationJsonLd } from "@/modules/shared/seo";
import { AdminBar } from "@/modules/shared/ui";
import { Footer, Header } from "@/modules/widgets";

import "../globals.css";

interface LocaleLayoutProps {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));

export const metadata: Metadata = {
    metadataBase: new URL(getServerSideURL()),
    twitter: { card: "summary_large_image" },
    ...(STOREFRONT_INDEXED ? {} : { robots: { index: false, follow: false } }),
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    const [{ isEnabled: preview }, settings, storefront] = await Promise.all([
        draftMode(),
        getSiteSettings(locale),
        getStorefrontContent(locale),
    ]);
    const contacts = resolveContacts(settings, storefront);
    const dictionary = getDictionary(locale);

    return (
        <html
            lang={locale}
            data-storefront={STOREFRONT}
            {...themeAttributes(STOREFRONT_PRESET)}
            className={fontVariables}
            suppressHydrationWarning
        >
            <body className="flex min-h-screen flex-col font-sans antialiased">
                <I18nProvider locale={locale} dictionary={dictionary}>
                    <JsonLd
                        data={organizationJsonLd({
                            name: settings.siteName || SITE.name,
                            url: getServerSideURL(),
                            phone: contacts.phone,
                            email: contacts.email,
                            sameAs: contacts.socials?.map((social) => social.url),
                        })}
                    />
                    <AdminBar adminBarProps={{ preview }} />
                    <Header locale={locale} />
                    <main id="content" className="flex-1">
                        {children}
                    </main>
                    <Footer locale={locale} />
                </I18nProvider>
            </body>
        </html>
    );
}
