"use client";

import { useState } from "react";

import Link from "next/link";

import { MenuIcon, PhoneIcon, XIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@workspace/ui/components/container";
import { cn } from "@workspace/ui/lib/utils";

import { AccountLink, LocaleSwitcher } from "@/modules/features";
import { ROUTES } from "@/modules/shared/config";
import { useI18n } from "@/modules/shared/i18n";
import { CmsLink, Logo } from "@/modules/shared/ui";
import type { Header as HeaderType } from "@/payload-types";

interface HeaderClientProps {
    navItems: NonNullable<HeaderType["navItems"]>;
    siteName?: string | null;
    phone?: string | null;
}

const NAV_LINK =
    "relative py-1 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 after:ease-soft hover:after:scale-x-100 focus-visible:after:scale-x-100";

const MOBILE_LINK =
    "block py-4 font-display text-2xl tracking-[-0.01em] text-foreground transition-colors hover:text-brand";

export const HeaderClient = ({ navItems, siteName, phone }: HeaderClientProps) => {
    const { locale, dictionary } = useI18n();
    const [open, setOpen] = useState(false);
    const tel = phone ? `tel:${phone.replace(/\s+/g, "")}` : null;

    const renderNav = (className: string) => (
        <>
            <CmsLink
                type="custom"
                url={ROUTES.catalog(locale)}
                label={dictionary.common.catalog}
                className={className}
            />
            <CmsLink
                type="custom"
                url={ROUTES.blog(locale)}
                label={dictionary.common.blog}
                className={className}
            />
            <CmsLink
                type="custom"
                url={ROUTES.contacts(locale)}
                label={dictionary.common.contacts}
                className={className}
            />
            {navItems.map(({ link }, index) => (
                <CmsLink key={index} {...link} className={className} />
            ))}
        </>
    );

    return (
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
            <Container className="flex h-16 items-center justify-between gap-6 md:h-20">
                <Link
                    href={ROUTES.home(locale)}
                    aria-label={dictionary.common.home}
                    className="shrink-0 rounded-md"
                >
                    <Logo name={siteName} />
                </Link>

                <nav
                    className="hidden items-center gap-7 md:flex"
                    aria-label={dictionary.common.navigation}
                >
                    {renderNav(NAV_LINK)}
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <LocaleSwitcher />
                    <AccountLink />
                    {tel && (
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="ml-1 hidden lg:inline-flex"
                        >
                            <a href={tel}>
                                <PhoneIcon aria-hidden />
                                {phone}
                            </a>
                        </Button>
                    )}
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-expanded={open}
                    aria-controls="mobile-nav"
                    onClick={() => setOpen((value) => !value)}
                >
                    {open ? (
                        <XIcon className="size-5" aria-hidden />
                    ) : (
                        <MenuIcon className="size-5" aria-hidden />
                    )}
                    <span className="sr-only">
                        {open ? dictionary.common.closeMenu : dictionary.common.menu}
                    </span>
                </Button>
            </Container>

            <div
                id="mobile-nav"
                hidden={!open}
                className={cn(
                    "absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-background shadow-lg md:hidden",
                    open && "animate-in fade-in slide-in-from-top-2 duration-200"
                )}
            >
                <Container className="flex flex-col pb-6 pt-2" onClick={() => setOpen(false)}>
                    <nav
                        className="flex flex-col divide-y divide-border/70"
                        aria-label={dictionary.common.navigation}
                    >
                        {renderNav(MOBILE_LINK)}
                    </nav>
                    <div className="mt-5 flex items-center justify-between gap-4">
                        <AccountLink showLabel />
                        <LocaleSwitcher />
                    </div>
                    {tel && (
                        <Button asChild size="lg" className="mt-5 w-full">
                            <a href={tel}>
                                <PhoneIcon aria-hidden />
                                {phone}
                            </a>
                        </Button>
                    )}
                </Container>
            </div>
        </header>
    );
};
