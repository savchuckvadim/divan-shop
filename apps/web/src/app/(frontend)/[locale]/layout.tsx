import type { ReactNode } from "react";

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { cn } from "@workspace/ui/lib/utils";

import { getSiteSettings } from "@/modules/entities";
import { isLocale, LOCALES, SITE } from "@/modules/shared/config";
import { getDictionary, I18nProvider } from "@/modules/shared/i18n";
import { getServerSideURL } from "@/modules/shared/lib";
import { JsonLd, organizationJsonLd } from "@/modules/shared/seo";
import { AdminBar } from "@/modules/shared/ui";
import { Footer, Header } from "@/modules/widgets";

import "../globals.css";

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    variable: "--font-inter",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin", "cyrillic"],
    variable: "--font-playfair",
    display: "swap",
});

interface LocaleLayoutProps {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));

export const metadata: Metadata = {
    metadataBase: new URL(getServerSideURL()),
    twitter: { card: "summary_large_image" },
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    const [{ isEnabled: preview }, settings] = await Promise.all([
        draftMode(),
        getSiteSettings(locale),
    ]);
    const dictionary = getDictionary(locale);

    return (
        <html
            lang={locale}
            className={cn(inter.variable, playfair.variable)}
            suppressHydrationWarning
        >
            <body className="flex min-h-screen flex-col font-sans antialiased">
                <I18nProvider locale={locale} dictionary={dictionary}>
                    <JsonLd
                        data={organizationJsonLd({
                            name: settings.siteName || SITE.name,
                            url: getServerSideURL(),
                            phone: settings.contacts?.phone,
                            email: settings.contacts?.email,
                            sameAs: settings.contacts?.socials?.map((social) => social.url),
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
