import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { PageHeader } from "@workspace/ui/composites/page-header";
import { Section } from "@workspace/ui/composites/section";

import { getCurrency, getProducts, getSiteSettings } from "@/modules/entities";
import { type Locale, ROUTES } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { ProductGrid } from "@/modules/widgets";

/**
 * Rendered until an editor creates the `home` page in the CMS, so a fresh
 * install never greets visitors with a 404.
 */
export const HomeFallback = async ({ locale }: { locale: Locale }) => {
    const { common, catalog, seo } = getDictionary(locale);
    const [settings, products] = await Promise.all([
        getSiteSettings(locale),
        getProducts({ locale, limit: 8 }),
    ]);

    return (
        <>
            <Section padding="lg" className="bg-secondary/40">
                <PageHeader title={common.tagline} description={seo.defaultDescription}>
                    <div className="mt-3">
                        <Button asChild size="lg">
                            <Link href={ROUTES.catalog(locale)}>{common.catalog}</Link>
                        </Button>
                    </div>
                </PageHeader>
            </Section>
            <Section title={catalog.featured}>
                <ProductGrid
                    products={products.docs}
                    currency={getCurrency(settings)}
                    locale={locale}
                />
            </Section>
        </>
    );
};
