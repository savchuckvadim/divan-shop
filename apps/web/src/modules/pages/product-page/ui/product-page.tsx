import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";

import { PhoneIcon } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Container } from "@workspace/ui/components/container";
import { Heading } from "@workspace/ui/components/heading";
import { Text } from "@workspace/ui/components/text";
import { Section } from "@workspace/ui/composites/section";
import { Stack } from "@workspace/ui/composites/stack";
import { cn } from "@workspace/ui/lib/utils";

import {
    getCurrency,
    getDiscountPercent,
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
    const cover = images[0];
    const discount = getDiscountPercent(product);
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
        <Container className="py-8 md:py-12">
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

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
                <div className="flex flex-col gap-3">
                    <div
                        data-slot="stage"
                        className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted"
                    >
                        {cover ? (
                            <Media
                                resource={cover}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 58vw"
                                imgClassName="object-cover"
                            />
                        ) : (
                            <span
                                aria-hidden
                                className="flex h-full items-center justify-center font-display text-7xl text-muted-foreground/40"
                            >
                                {product.title.charAt(0)}
                            </span>
                        )}
                        {discount && (
                            <Badge className="absolute left-4 top-4 shadow-sm">
                                <span className="sr-only">{dictionary.product.discount} </span>−
                                {discount}%
                            </Badge>
                        )}
                    </div>
                    {images.length > 1 && (
                        <ul
                            className="grid grid-cols-4 gap-3 sm:grid-cols-5"
                            aria-label={dictionary.product.gallery}
                        >
                            {images.map((image, index) => (
                                <li
                                    key={image.id}
                                    className={cn(
                                        "relative aspect-square overflow-hidden rounded-xl border-2 bg-muted transition-colors duration-200",
                                        index === 0
                                            ? "border-primary"
                                            : "border-transparent ring-1 ring-border hover:border-primary/50"
                                    )}
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

                <div className="flex flex-col gap-7 lg:sticky lg:top-24 lg:self-start">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            {category && (
                                <Text as="span" eyebrow className="text-muted-foreground">
                                    <Link
                                        href={ROUTES.category(locale, category.slug ?? "")}
                                        className="underline-offset-4 hover:underline"
                                    >
                                        {category.title}
                                    </Link>
                                </Text>
                            )}
                            <ProductAvailabilityBadge availability={product.availability} />
                        </div>
                        <Heading as="h1" size="lg">
                            {product.title}
                        </Heading>
                        <ProductPrice
                            price={product.price}
                            oldPrice={product.oldPrice}
                            currency={currency}
                            size="lg"
                        />
                    </div>

                    <Stack gap="sm">
                        <Button asChild size="lg" className="w-full">
                            <Link href={ROUTES.contacts(locale, slug)}>
                                {dictionary.product.contactManager}
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="h-auto min-h-12 w-full whitespace-normal py-3 text-center"
                        >
                            <Link href={ROUTES.register(locale, `product-${slug}`)}>
                                {dictionary.product.showroomCode}
                            </Link>
                        </Button>
                        {phone && (
                            <a
                                href={`tel:${phone.replace(/\s+/g, "")}`}
                                className="mt-1 inline-flex items-center gap-2 self-center text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                            >
                                <PhoneIcon className="size-4" aria-hidden />
                                {dictionary.product.requestQuote}: {phone}
                            </a>
                        )}
                    </Stack>

                    <ProductSpecs specs={product.specs} locale={locale} />
                </div>
            </div>

            {product.description && (
                <Section
                    contained={false}
                    padding="md"
                    title={dictionary.product.description}
                    className="max-w-[65ch]"
                >
                    <RichText data={product.description} enableGutter={false} />
                </Section>
            )}

            {related.length > 0 && (
                <Section
                    contained={false}
                    padding="md"
                    eyebrow={category?.title}
                    title={dictionary.product.related}
                    className="border-t border-border/70"
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
    const [product, settings] = await Promise.all([
        getProductBySlug(slug, locale, draft),
        getSiteSettings(locale),
    ]);
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
        product: {
            price: product.price,
            currency: getCurrency(settings),
            availability: product.availability,
        },
    });
};
