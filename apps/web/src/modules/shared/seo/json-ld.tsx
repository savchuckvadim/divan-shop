import type { Thing, WithContext } from "schema-dts";

type JsonLdData = WithContext<Thing>;

export const JsonLd = ({ data }: { data: JsonLdData | JsonLdData[] }) => (
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
            __html: JSON.stringify(data).replace(/</g, "\\u003c"),
        }}
    />
);

export interface BreadcrumbItem {
    name: string;
    url: string;
}

export const breadcrumbsJsonLd = (items: BreadcrumbItem[]): JsonLdData => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
    })),
});

export interface OrganizationJsonLdArgs {
    name: string;
    url: string;
    logo?: string;
    phone?: string | null;
    email?: string | null;
    sameAs?: string[];
}

export const organizationJsonLd = ({
    name,
    url,
    logo,
    phone,
    email,
    sameAs,
}: OrganizationJsonLdArgs): JsonLdData => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    ...(logo ? { logo } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    ...(sameAs?.length ? { sameAs } : {}),
});

export interface ArticleJsonLdArgs {
    headline: string;
    description?: string;
    url: string;
    image?: string;
    datePublished?: string | null;
    dateModified?: string | null;
    authorName?: string | null;
    publisherName: string;
    publisherLogo?: string;
    inLanguage: string;
}

export const articleJsonLd = ({
    headline,
    description,
    url,
    image,
    datePublished,
    dateModified,
    authorName,
    publisherName,
    publisherLogo,
    inLanguage,
}: ArticleJsonLdArgs): JsonLdData => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    ...(description ? { description } : {}),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(image ? { image: [image] } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    inLanguage,
    author: authorName
        ? { "@type": "Person", name: authorName }
        : { "@type": "Organization", name: publisherName },
    publisher: {
        "@type": "Organization",
        name: publisherName,
        ...(publisherLogo ? { logo: { "@type": "ImageObject", url: publisherLogo } } : {}),
    },
});

export interface FaqJsonLdItem {
    question: string;
    answer: string;
}

export const faqJsonLd = (items: FaqJsonLdItem[]): JsonLdData => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
});

export interface ProductJsonLdArgs {
    name: string;
    description?: string;
    url: string;
    images: string[];
    sku: string;
    brand: string;
    price: number;
    currency: string;
    inStock: boolean;
}

export const productJsonLd = ({
    name,
    description,
    url,
    images,
    sku,
    brand,
    price,
    currency,
    inStock,
}: ProductJsonLdArgs): JsonLdData => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    ...(description ? { description } : {}),
    url,
    image: images,
    sku,
    brand: { "@type": "Brand", name: brand },
    offers: {
        "@type": "Offer",
        url,
        price,
        priceCurrency: currency,
        availability: inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
        itemCondition: "https://schema.org/NewCondition",
    },
});
