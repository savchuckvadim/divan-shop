import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@workspace/ui/components/container";
import { Heading } from "@workspace/ui/components/heading";
import { Text } from "@workspace/ui/components/text";

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
            <section className="bg-secondary/40">
                <Container className="flex flex-col gap-6 py-20 md:py-28">
                    <Heading as="h1" size="xl" className="max-w-[40rem]">
                        {common.tagline}
                    </Heading>
                    <Text size="lg" muted className="max-w-[36rem]">
                        {seo.defaultDescription}
                    </Text>
                    <div>
                        <Button asChild size="lg">
                            <Link href={ROUTES.catalog(locale)}>{common.catalog}</Link>
                        </Button>
                    </div>
                </Container>
            </section>
            <Container className="py-16">
                <Heading as="h2" size="md" className="mb-8">
                    {catalog.featured}
                </Heading>
                <ProductGrid
                    products={products.docs}
                    currency={getCurrency(settings)}
                    locale={locale}
                />
            </Container>
        </>
    );
};
