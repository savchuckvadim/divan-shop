import Link from "next/link";

import { ArrowUpRightIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@workspace/ui/components/container";
import { Text } from "@workspace/ui/components/text";

import { getSiteSettings } from "@/modules/entities";
import { LocaleSwitcher } from "@/modules/features";
import { getCachedGlobal } from "@/modules/shared/api";
import { type Locale, ROUTES } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { CmsLink, Logo } from "@/modules/shared/ui";

const FOOTER_LINK = "w-fit text-sm text-muted-foreground transition-colors hover:text-foreground";

const CONTACT_ROW =
    "flex items-start gap-2.5 text-sm text-foreground/85 [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-brand";

export const Footer = async ({ locale }: { locale: Locale }) => {
    const [footer, settings] = await Promise.all([
        getCachedGlobal("footer", locale, 1)(),
        getSiteSettings(locale),
    ]);
    const { common, home } = getDictionary(locale);
    const contacts = settings.contacts;
    const year = new Date().getFullYear();

    return (
        <footer className="relative mt-auto bg-secondary/35">
            <div aria-hidden className="h-px bg-horizon" />
            <Container className="grid gap-12 py-14 md:grid-cols-2 md:py-16 lg:grid-cols-[1.5fr_1fr_1.2fr_1fr] lg:gap-10">
                <div className="flex flex-col gap-5">
                    <Link href={ROUTES.home(locale)} className="w-fit rounded-md">
                        <Logo name={settings.siteName} size="lg" />
                    </Link>
                    <Text className="max-w-[30ch] font-display text-lg italic leading-snug text-foreground/80">
                        {common.tagline}
                    </Text>
                    <Button asChild className="w-fit">
                        <Link href={ROUTES.account(locale)}>{home.ctaVisit}</Link>
                    </Button>
                </div>

                <nav className="flex flex-col gap-3" aria-label={common.navigation}>
                    <Text as="span" eyebrow muted className="mb-1">
                        {common.navigation}
                    </Text>
                    <CmsLink
                        type="custom"
                        url={ROUTES.catalog(locale)}
                        label={common.catalog}
                        className={FOOTER_LINK}
                    />
                    <CmsLink
                        type="custom"
                        url={ROUTES.blog(locale)}
                        label={common.blog}
                        className={FOOTER_LINK}
                    />
                    <CmsLink
                        type="custom"
                        url={ROUTES.contacts(locale)}
                        label={common.contacts}
                        className={FOOTER_LINK}
                    />
                    {(footer.navItems ?? []).map(({ link }, index) => (
                        <CmsLink key={index} {...link} className={FOOTER_LINK} />
                    ))}
                </nav>

                <address className="flex flex-col gap-3 not-italic">
                    <Text as="span" eyebrow muted className="mb-1">
                        {common.contacts}
                    </Text>
                    {contacts?.phone && (
                        <a
                            href={`tel:${contacts.phone.replace(/\s+/g, "")}`}
                            className={`${CONTACT_ROW} font-medium hover:text-foreground`}
                        >
                            <PhoneIcon aria-hidden />
                            {contacts.phone}
                        </a>
                    )}
                    {contacts?.email && (
                        <a
                            href={`mailto:${contacts.email}`}
                            className={`${CONTACT_ROW} hover:text-foreground`}
                        >
                            <MailIcon aria-hidden />
                            {contacts.email}
                        </a>
                    )}
                    {contacts?.address && (
                        <span className={CONTACT_ROW}>
                            <MapPinIcon aria-hidden />
                            {contacts.address}
                        </span>
                    )}
                    {contacts?.workingHours && (
                        <span className={`${CONTACT_ROW} text-muted-foreground`}>
                            <ClockIcon aria-hidden />
                            {contacts.workingHours}
                        </span>
                    )}
                    {contacts?.socials?.length ? (
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2">
                            {contacts.socials.map((social) => (
                                <a
                                    key={social.url}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm font-medium text-foreground/85 underline-offset-4 hover:underline"
                                >
                                    {social.label}
                                    <ArrowUpRightIcon className="size-3.5" aria-hidden />
                                </a>
                            ))}
                        </div>
                    ) : null}
                </address>

                <div className="flex flex-col gap-3">
                    <Text as="span" eyebrow muted className="mb-1">
                        {common.language}
                    </Text>
                    <LocaleSwitcher className="w-fit" />
                </div>
            </Container>
            <Container className="flex flex-col gap-2 border-t border-border/60 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                    {footer.copyright ||
                        `© ${year} ${settings.siteName || common.siteName}. ${common.allRightsReserved}`}
                </span>
                <span>{common.cityLine}</span>
            </Container>
        </footer>
    );
};
