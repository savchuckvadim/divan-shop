"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@workspace/ui/lib/utils";

import {
    type Locale,
    LOCALE_COOKIE,
    LOCALE_LABELS,
    LOCALES,
    stripLocale,
    withLocale,
} from "@/modules/shared/config";
import { useI18n } from "@/modules/shared/i18n";

const rememberLocale = (locale: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
};

export const LocaleSwitcher = ({ className }: { className?: string }) => {
    const { locale: current, dictionary } = useI18n();
    const pathname = usePathname();
    const pathWithoutLocale = stripLocale(pathname);

    return (
        <nav
            aria-label={dictionary.common.language}
            className={cn("flex items-center gap-1", className)}
        >
            {LOCALES.map((locale) => (
                <Link
                    key={locale}
                    href={withLocale(locale, pathWithoutLocale)}
                    hrefLang={locale}
                    lang={locale}
                    aria-current={locale === current ? "true" : undefined}
                    onClick={() => rememberLocale(locale)}
                    title={LOCALE_LABELS[locale]}
                    className={cn(
                        "rounded-md px-2 py-1 text-xs font-medium uppercase transition-colors",
                        locale === current
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {locale}
                </Link>
            ))}
        </nav>
    );
};
