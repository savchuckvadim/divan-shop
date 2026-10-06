"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@workspace/ui/lib/utils";

import {
    type Locale,
    LOCALE_COOKIE,
    LOCALE_LABELS,
    LOCALE_SHORT,
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
            className={cn(
                "inline-flex items-center gap-0.5 rounded-full border border-border/80 bg-muted/60 p-0.5",
                className
            )}
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
                        "rounded-full px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] transition-colors",
                        locale === current
                            ? "bg-background text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {LOCALE_SHORT[locale]}
                </Link>
            ))}
        </nav>
    );
};
