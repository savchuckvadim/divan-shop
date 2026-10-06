import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionSlug, Payload, RequiredDataFromCollectionSlug } from "payload";

import { DEFAULT_LOCALE, type Locale, LOCALES } from "@/modules/shared/config";
import type { Footer, Header } from "@/payload-types";

import { articleLocaleData, ARTICLES_SEED } from "./data/articles";
import { CATEGORIES_SEED } from "./data/categories";
import { CONTACT_FORM_TITLE, contactFormData } from "./data/form";
import { aboutPageData, contactsPageData, homePageData, type PageLocaleData } from "./data/pages";
import { productDescription, PRODUCTS_SEED } from "./data/products";
import { type Localized, NAV_LABELS, SITE_SEED } from "./data/site";
import { ARTICLE_COVERS, DETAIL_ALT, SCENE_ALT, STOREFRONTS_SEED } from "./data/storefronts";
import { richText } from "./lexical";

/** Hooks call `next/cache`, which is unavailable outside the Next runtime. */
const context = { disableRevalidate: true };

const OTHER_LOCALES: Locale[] = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

/** Demo photos from the design prototypes; in Docker the tools image includes them (.dockerignore). */
const ASSETS_DIR = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../../../design/concepts/assets"
);

type NavItem = NonNullable<Header["navItems"]>[number];

interface SeedLogger {
    info: (message: string) => void;
}

const findBySlug = async <T extends CollectionSlug>(
    payload: Payload,
    collection: T,
    slug: string
) => {
    const { docs } = await payload.find({
        collection,
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
        pagination: false,
    });
    return docs[0] ?? null;
};

/**
 * Creates a doc in the default locale, then writes every other locale on top of it.
 * `data(locale)` must return the localized fields; `base` holds the non-localized ones.
 */
const createLocalized = async <T extends CollectionSlug>(
    payload: Payload,
    collection: T,
    base: Partial<RequiredDataFromCollectionSlug<T>>,
    data: (locale: Locale) => Partial<RequiredDataFromCollectionSlug<T>>
) => {
    type UpdateData = Parameters<typeof payload.update<T, never>>[0]["data"];

    const created = await payload.create({
        collection,
        locale: DEFAULT_LOCALE,
        context,
        data: { ...base, ...data(DEFAULT_LOCALE) } as RequiredDataFromCollectionSlug<T>,
    });
    for (const locale of OTHER_LOCALES) {
        await payload.update({
            collection,
            id: created.id,
            locale,
            context,
            data: { ...base, ...data(locale) } as UpdateData,
        });
    }
    return created;
};

const seedSiteSettings = async (payload: Payload, log: SeedLogger) => {
    const existing = await payload.findGlobal({ slug: "site-settings", depth: 0 });
    if (existing.siteName) {
        log.info("site-settings: already filled, skipped");
        return;
    }
    for (const locale of LOCALES) {
        await payload.updateGlobal({
            slug: "site-settings",
            locale,
            context,
            data: {
                siteName: SITE_SEED.siteName,
                currency: SITE_SEED.currency,
                contacts: {
                    phone: SITE_SEED.phone,
                    email: SITE_SEED.email,
                    address: SITE_SEED.address[locale],
                    workingHours: SITE_SEED.workingHours[locale],
                },
            },
        });
    }
    log.info("site-settings: created");
};

const seedContactForm = async (payload: Payload, log: SeedLogger): Promise<number> => {
    const { docs } = await payload.find({
        collection: "forms",
        where: { title: { equals: CONTACT_FORM_TITLE } },
        limit: 1,
        depth: 0,
    });
    if (docs[0]) {
        log.info(`forms: "${CONTACT_FORM_TITLE}" exists, skipped`);
        return docs[0].id;
    }
    const form = await createLocalized(
        payload,
        "forms",
        { title: CONTACT_FORM_TITLE, confirmationType: "message" },
        (locale) => contactFormData(locale)
    );
    log.info(`forms: created "${CONTACT_FORM_TITLE}"`);
    return form.id;
};

const seedCategories = async (payload: Payload, log: SeedLogger) => {
    let created = 0;
    for (const [index, category] of CATEGORIES_SEED.entries()) {
        if (await findBySlug(payload, "categories", category.slug)) continue;
        await createLocalized(
            payload,
            "categories",
            { slug: category.slug, order: index },
            (locale) => ({
                title: category.title[locale],
                description: category.description[locale],
                meta: { title: category.title[locale], description: category.description[locale] },
            })
        );
        created += 1;
    }
    log.info(`categories: created ${created}, skipped ${CATEGORIES_SEED.length - created}`);
};

const seedPage = async (
    payload: Payload,
    log: SeedLogger,
    slug: string,
    data: (locale: Locale) => PageLocaleData
): Promise<number> => {
    const existing = await findBySlug(payload, "pages", slug);
    if (existing) {
        log.info(`pages: "${slug}" exists, skipped`);
        return existing.id;
    }
    const page = await createLocalized(payload, "pages", { slug, _status: "published" }, data);
    log.info(`pages: created "${slug}"`);
    return page.id;
};

const withRowIds = (existing: NavItem[] | null | undefined, items: NavItem[]): NavItem[] =>
    items.map((item, index) => ({ ...item, id: existing?.[index]?.id ?? item.id }));

const seedNav = async (
    payload: Payload,
    log: SeedLogger,
    slug: "header" | "footer",
    aboutPageId: number
) => {
    const existing = await payload.findGlobal({ slug, depth: 0 });
    if (existing.navItems?.length) {
        log.info(`${slug}: nav already filled, skipped`);
        return;
    }
    const items = (locale: Locale): NavItem[] => [
        {
            link: {
                type: "reference",
                newTab: false,
                reference: { relationTo: "pages", value: aboutPageId },
                label: NAV_LABELS.about[locale],
            },
        },
    ];
    const saved = await payload.updateGlobal({
        slug,
        locale: DEFAULT_LOCALE,
        context,
        depth: 0,
        data: { navItems: items(DEFAULT_LOCALE) },
    });
    const savedItems = (saved as Header | Footer).navItems;
    for (const locale of OTHER_LOCALES) {
        await payload.updateGlobal({
            slug,
            locale,
            context,
            depth: 0,
            data: { navItems: withRowIds(savedItems, items(locale)) },
        });
    }
    log.info(`${slug}: nav created`);
};

const seedArticles = async (payload: Payload, log: SeedLogger) => {
    const { docs: users } = await payload.find({ collection: "users", limit: 1, depth: 0 });
    const authorId = users[0]?.id;
    let created = 0;
    for (const article of ARTICLES_SEED) {
        if (await findBySlug(payload, "articles", article.slug)) continue;
        await createLocalized(
            payload,
            "articles",
            {
                slug: article.slug,
                publishedAt: article.publishedAt,
                author: authorId,
                _status: "published",
            },
            (locale) => articleLocaleData(article, locale)
        );
        created += 1;
    }
    log.info(`articles: created ${created}, skipped ${ARTICLES_SEED.length - created}`);
};

const mediaIds = new Map<string, number>();

/** Uploads design/concepts/assets/<asset>.webp once (matched by filename) with a localized alt. */
const seedImage = async (payload: Payload, asset: string, alt: Localized<string>) => {
    const known = mediaIds.get(asset);
    if (known) return known;
    const filename = `${asset}.webp`;
    const { docs } = await payload.find({
        collection: "media",
        where: { filename: { equals: filename } },
        limit: 1,
        depth: 0,
        pagination: false,
    });
    let id = docs[0]?.id;
    if (!id) {
        const created = await payload.create({
            collection: "media",
            locale: DEFAULT_LOCALE,
            context,
            data: { alt: alt[DEFAULT_LOCALE] },
            filePath: path.join(ASSETS_DIR, filename),
        });
        id = created.id;
        for (const locale of OTHER_LOCALES) {
            await payload.update({
                collection: "media",
                id,
                locale,
                context,
                data: { alt: alt[locale] },
            });
        }
    }
    mediaIds.set(asset, id);
    return id;
};

const seedProducts = async (payload: Payload, log: SeedLogger) => {
    let created = 0;
    for (const product of PRODUCTS_SEED) {
        if (await findBySlug(payload, "products", product.slug)) continue;
        const category = await findBySlug(payload, "categories", product.category);
        if (!category) {
            log.info(`products: no category "${product.category}", skipped ${product.slug}`);
            continue;
        }
        const gallery: { image: number }[] = [];
        for (const [index, asset] of product.images.entries()) {
            const alt =
                index === 0 ? product.title : asset.startsWith("detail") ? DETAIL_ALT : SCENE_ALT;
            gallery.push({ image: await seedImage(payload, asset, alt) });
        }
        const description = productDescription(product);
        await createLocalized(
            payload,
            "products",
            {
                slug: product.slug,
                category: category.id,
                price: product.price,
                oldPrice: product.oldPrice,
                availability: product.availability,
                featured: product.featured ?? false,
                gallery,
                _status: "published",
            },
            (locale) => ({
                title: product.title[locale],
                description: richText(...description[locale]),
                specs: { ...product.specs, color: product.color[locale] },
                meta: { title: product.title[locale], description: description[locale][0] },
            })
        );
        created += 1;
    }
    log.info(`products: created ${created}, skipped ${PRODUCTS_SEED.length - created}`);
};

const seedStorefronts = async (payload: Payload, log: SeedLogger) => {
    let created = 0;
    for (const storefront of STOREFRONTS_SEED) {
        const { docs } = await payload.find({
            collection: "storefronts",
            where: { key: { equals: storefront.key } },
            limit: 1,
            depth: 0,
            pagination: false,
        });
        if (docs[0]) continue;
        const slides: { image: number }[] = [];
        for (const asset of storefront.slides) {
            slides.push({ image: await seedImage(payload, asset, SCENE_ALT) });
        }
        await createLocalized(
            payload,
            "storefronts",
            { key: storefront.key, domain: storefront.domain },
            (locale) => ({
                slogan: storefront.slogan[locale],
                hero: {
                    heading: storefront.heading[locale],
                    text: storefront.text[locale],
                    slides,
                    cta: storefront.cta,
                },
            })
        );
        created += 1;
    }
    log.info(`storefronts: created ${created}, skipped ${STOREFRONTS_SEED.length - created}`);
};

const seedArticleCovers = async (payload: Payload, log: SeedLogger) => {
    let updated = 0;
    for (const [slug, asset] of Object.entries(ARTICLE_COVERS)) {
        const article = await findBySlug(payload, "articles", slug);
        if (!article || article.cover) continue;
        const cover = await seedImage(payload, asset, SCENE_ALT);
        await payload.update({ collection: "articles", id: article.id, context, data: { cover } });
        updated += 1;
    }
    log.info(`articles: covers set ${updated}`);
};

export const seed = async (payload: Payload): Promise<void> => {
    const log: SeedLogger = { info: (message) => payload.logger.info(`[seed] ${message}`) };

    await seedSiteSettings(payload, log);
    const formId = await seedContactForm(payload, log);
    await seedCategories(payload, log);
    await seedProducts(payload, log);
    await seedStorefronts(payload, log);

    const contactsPageId = await seedPage(payload, log, "contacts", (locale) =>
        contactsPageData(locale, { formId })
    );
    const aboutPageId = await seedPage(payload, log, "about", aboutPageData);
    await seedPage(payload, log, "home", (locale) => homePageData(locale, { contactsPageId }));

    await seedNav(payload, log, "header", aboutPageId);
    await seedNav(payload, log, "footer", aboutPageId);

    await seedArticles(payload, log);
    await seedArticleCovers(payload, log);
};
