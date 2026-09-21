import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@workspace/ui/components/container";
import { Heading } from "@workspace/ui/components/heading";
import { Section } from "@workspace/ui/composites/section";

import {
    getCurrency,
    getProductBySlug,
    getProductCategory,
    getProductImages,
    getProducts,
    getSiteSettings,
    ProductAvailabilityBadge,
    ProductPrice,
} from "@/modules/entities";
import { type Locale, ROUTES, SITE } from "@/modules/shared/config";
import { getDictionary, interpolate } from "@/modules/shared/i18n";
import { absoluteUrl } from "@/modules/shared/lib";
import { generateMeta, JsonLd, productJsonLd } from "@/modules/shared/seo";
import { LivePreviewListener, Media, RichText } from "@/modules/shared/ui";
import { PayloadRedirects } from "@/modules/shared/ui/payload-redirects";
import { Breadcrumbs, type Crumb, ProductGrid } from "@/modules/widgets";

import { ProductSpecs } from "./product-specs";

interface ProductPageProps {
    locale: Locale;
    slug: string;
}

export const ProductPage = async ({ locale, slug }: ProductPageProps) => {
    const { isEnabled: draft } = await draftMode();
    const [product, settings] = await Promise.all([
        getProductBySlug(slug, locale, draft),
        getSiteSettings(locale),
    ]);

    if (!product) {
        return <PayloadRedirects url={`/product/${slug}`} locale={locale} />;
    }

    const dictionary = getDictionary(locale);
    const currency = getCurrency(settings);
    const category = getProductCategory(product);
    const images = getProductImages(product);
    const [cover, ...thumbnails] = images;
    const phone = settings.contacts?.phone;

    const related = category
        ? (await getProducts({ locale, categoryIds: [category.id], limit: 5 })).docs
              .filter((item) => item.id !== product.id)
              .slice(0, 4)
        : [];

    const crumbs: Crumb[] = [
        { label: dictionary.common.home, href: ROUTES.home(locale) },
        { label: dictionary.common.catalog, href: ROUTES.catalog(locale) },
        ...(category
            ? [{ label: category.title, href: ROUTES.category(locale, category.slug ?? "") }]
            : []),
        { label: product.title, href: ROUTES.product(locale, slug) },
    ];

    return (
        <Container className="py-10">
            <PayloadRedirects disableNotFound url={`/product/${slug}`} locale={locale} />
            {draft && <LivePreviewListener />}

            <JsonLd
                data={productJsonLd({
                    name: product.title,
                    description: product.meta?.description ?? undefined,
                    url: absoluteUrl(ROUTES.product(locale, slug)),
                    images: images.map((image) => absoluteUrl(image.url ?? "")),
                    sku: String(product.id),
                    brand: settings.siteName || SITE.name,
                    price: product.price,
                    currency,
                    inStock: product.availability === "inStock",
                })}
            />

            <Breadcrumbs items={crumbs} />

            <div className="mt-8 grid gap-10 lg:grid-cols-2">
                <div className="flex flex-col gap-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
                        {cover && (
                            <Media
                                resource={cover}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                imgClassName="object-cover"
                            />
                        )}
                    </div>
                    {thumbnails.length > 0 && (
                        <ul className="grid grid-cols-4 gap-3">
                            {thumbnails.map((image) => (
                                <li
                                    key={image.id}
                                    className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                                >
                                    <Media
                                        resource={image}
                                        fill
                                        sizes="12vw"
                                        imgClassName="object-cover"
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <ProductAvailabilityBadge availability={product.availability} />
                        <Heading as="h1" size="xl">
                            {product.title}
                        </Heading>
                        <ProductPrice
                            price={product.price}
                            oldPrice={product.oldPrice}
                            currency={currency}
                            size="lg"
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild size="lg" className="w-full sm:w-auto">
                            <Link href={ROUTES.contacts(locale, slug)}>
                                {dictionary.product.contactManager}
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                            <Link href={ROUTES.register(locale, `product-${slug}`)}>
                                {dictionary.product.showroomCode}
                            </Link>
                        </Button>
                    </div>
                    {phone && (
                        <a
                            href={`tel:${phone.replace(/\s+/g, "")}`}
                            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                        >
                            {dictionary.product.requestQuote}: {phone}
                        </a>
                    )}

                    <div className="flex flex-col gap-3">
                        <Heading as="h2" size="sm">
                            {dictionary.product.specsTitle}
                        </Heading>
                        <ProductSpecs specs={product.specs} locale={locale} />
                    </div>
                </div>
            </div>

            {product.description && (
                <Section
                    contained={false}
                    padding="sm"
                    title={dictionary.product.description}
                    className="mt-8 max-w-[48rem]"
                >
                    <RichText data={product.description} enableGutter={false} />
                </Section>
            )}

            {related.length > 0 && (
                <Section
                    contained={false}
                    padding="sm"
                    title={dictionary.product.related}
                    className="mt-4"
                >
                    <ProductGrid products={related} currency={currency} locale={locale} />
                </Section>
            )}
        </Container>
    );
};

export const generateProductPageMetadata = async ({
    locale,
    slug,
}: ProductPageProps): Promise<Metadata> => {
    const { isEnabled: draft } = await draftMode();
    const product = await getProductBySlug(slug, locale, draft);
    const { seo } = getDictionary(locale);

    if (!product) {
        return { title: seo.defaultTitle };
    }

    return generateMeta({
        locale,
        pathFor: (l) => ROUTES.product(l, slug),
        meta: {
            title: product.meta?.title,
            description: product.meta?.description,
            image: product.meta?.image ?? getProductImages(product)[0],
        },
        fallbackTitle: interpolate(seo.productTitle, { title: product.title }),
        fallbackDescription: interpolate(seo.productDescription, { title: product.title }),
    });
};
