"use client";

import { useState } from "react";

import Link from "next/link";

import { MenuIcon, PhoneIcon, XIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@workspace/ui/components/container";
import { cn } from "@workspace/ui/lib/utils";

import { LocaleSwitcher } from "@/modules/features";
import { ROUTES } from "@/modules/shared/config";
import { useI18n } from "@/modules/shared/i18n";
import { CmsLink, Logo } from "@/modules/shared/ui";
import type { Header as HeaderType } from "@/payload-types";

interface HeaderClientProps {
    navItems: NonNullable<HeaderType["navItems"]>;
    siteName?: string | null;
    phone?: string | null;
}

export const HeaderClient = ({ navItems, siteName, phone }: HeaderClientProps) => {
    const { locale, dictionary } = useI18n();
    const [open, setOpen] = useState(false);

    const nav = (
        <>
            <CmsLink
                type="custom"
                url={ROUTES.catalog(locale)}
                label={dictionary.common.catalog}
                appearance="link"
                className="text-base"
            />
            <CmsLink
                type="custom"
                url={ROUTES.blog(locale)}
                label={dictionary.common.blog}
                appearance="link"
                className="text-base"
            />
            <CmsLink
                type="custom"
                url={ROUTES.contacts(locale)}
                label={dictionary.common.contacts}
                appearance="link"
                className="text-base"
            />
            {navItems.map(({ link }, index) => (
                <CmsLink key={index} {...link} appearance="link" className="text-base" />
            ))}
        </>
    );

    return (
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
            <Container className="flex h-16 items-center justify-between gap-6">
                <Link href={ROUTES.home(locale)} aria-label={dictionary.common.home}>
                    <Logo name={siteName} />
                </Link>

                <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
                    {nav}
                </nav>

                <div className="hidden items-center gap-4 md:flex">
                    <LocaleSwitcher />
                    {phone && (
                        <Button asChild variant="outline" size="sm">
                            <a href={`tel:${phone.replace(/\s+/g, "")}`}>
                                <PhoneIcon className="size-4" />
                                {phone}
                            </a>
                        </Button>
                    )}
                </div>

                <button
                    type="button"
                    className="md:hidden"
                    aria-expanded={open}
                    aria-controls="mobile-nav"
                    onClick={() => setOpen((value) => !value)}
                >
                    {open ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
                    <span className="sr-only">{dictionary.common.catalog}</span>
                </button>
            </Container>

            <div
                id="mobile-nav"
                className={cn(
                    "border-t border-border bg-background md:hidden",
                    open ? "block" : "hidden"
                )}
            >
                <Container className="flex flex-col gap-4 py-4" onClick={() => setOpen(false)}>
                    {nav}
                    <LocaleSwitcher />
                    {phone && (
                        <a href={`tel:${phone.replace(/\s+/g, "")}`} className="font-medium">
                            {phone}
                        </a>
                    )}
                </Container>
            </div>
        </header>
    );
};
