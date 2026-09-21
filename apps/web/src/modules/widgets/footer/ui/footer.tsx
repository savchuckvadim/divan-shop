import Link from "next/link";

import { Container } from "@workspace/ui/components/container";

import { getSiteSettings } from "@/modules/entities";
import { getCachedGlobal } from "@/modules/shared/api";
import { type Locale, ROUTES } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { CmsLink, Logo } from "@/modules/shared/ui";

export const Footer = async ({ locale }: { locale: Locale }) => {
    const [footer, settings] = await Promise.all([
        getCachedGlobal("footer", locale, 1)(),
        getSiteSettings(locale),
    ]);
    const { common } = getDictionary(locale);
    const contacts = settings.contacts;
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-border bg-secondary/40">
            <Container className="grid gap-10 py-12 md:grid-cols-3">
                <div className="flex flex-col gap-3">
                    <Link href={ROUTES.home(locale)}>
                        <Logo name={settings.siteName} />
                    </Link>
                    <p className="text-sm text-muted-foreground">{common.tagline}</p>
                </div>

                <nav className="flex flex-col gap-2" aria-label="Footer">
                    <CmsLink type="custom" url={ROUTES.catalog(locale)} label={common.catalog} />
                    {(footer.navItems ?? []).map(({ link }, index) => (
                        <CmsLink key={index} {...link} />
                    ))}
                </nav>

                <address className="flex flex-col gap-2 text-sm not-italic">
                    {contacts?.phone && (
                        <a href={`tel:${contacts.phone.replace(/\s+/g, "")}`}>{contacts.phone}</a>
                    )}
                    {contacts?.email && <a href={`mailto:${contacts.email}`}>{contacts.email}</a>}
                    {contacts?.address && <span>{contacts.address}</span>}
                    {contacts?.workingHours && (
                        <span className="text-muted-foreground">{contacts.workingHours}</span>
                    )}
                    {contacts?.socials?.length ? (
                        <div className="mt-2 flex gap-3">
                            {contacts.socials.map((social) => (
                                <a
                                    key={social.url}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline-offset-4 hover:underline"
                                >
                                    {social.label}
                                </a>
                            ))}
                        </div>
                    ) : null}
                </address>
            </Container>
            <Container className="border-t border-border/60 py-4 text-xs text-muted-foreground">
                {footer.copyright ||
                    `© ${year} ${settings.siteName || common.siteName}. ${common.allRightsReserved}`}
            </Container>
        </footer>
    );
};
