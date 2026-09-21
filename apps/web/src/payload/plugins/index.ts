import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { seoPlugin } from "@payloadcms/plugin-seo";
import type { GenerateTitle, GenerateURL } from "@payloadcms/plugin-seo/types";
import type { Plugin } from "payload";

import { DEFAULT_LOCALE, isLocale, type Locale, ROUTES, SITE } from "@/modules/shared/config";
import { getServerSideURL } from "@/modules/shared/lib";
import type { Article, Page, Product } from "@/payload-types";

import { richTextEditor } from "../fields";
import { revalidateRedirects } from "../hooks";

type SeoDoc = Article | Page | Product;

const generateTitle: GenerateTitle<SeoDoc> = ({ doc }) =>
    doc?.title ? `${doc.title} | ${SITE.name}` : SITE.name;

const pathFor = (collectionSlug: string | undefined, locale: Locale, slug: string): string => {
    switch (collectionSlug) {
        case "products":
            return ROUTES.product(locale, slug);
        case "articles":
            return ROUTES.article(locale, slug);
        default:
            return ROUTES.page(locale, slug);
    }
};

const generateURL: GenerateURL<SeoDoc> = ({ doc, collectionSlug, locale }) => {
    const base = getServerSideURL();
    const resolvedLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
    if (!doc?.slug) return base;
    return `${base}${pathFor(collectionSlug, resolvedLocale, doc.slug)}`;
};

const LOCALIZED_FORM_FIELDS = ["fields", "submitButtonLabel", "confirmationMessage"];

export const plugins: Plugin[] = [
    redirectsPlugin({
        collections: ["pages", "products", "articles"],
        overrides: {
            // @ts-expect-error - mapped fields don't resolve to the same type
            fields: ({ defaultFields }) =>
                defaultFields.map((field) =>
                    "name" in field && field.name === "from"
                        ? {
                              ...field,
                              admin: {
                                  description:
                                      "You will need to rebuild the website when changing this field.",
                              },
                          }
                        : field
                ),
            hooks: { afterChange: [revalidateRedirects] },
        },
    }),
    seoPlugin({ generateTitle, generateURL }),
    formBuilderPlugin({
        fields: { payment: false, country: false, state: false },
        formOverrides: {
            fields: ({ defaultFields }) =>
                defaultFields.map((field) => {
                    if (!("name" in field)) return field;
                    const localized = LOCALIZED_FORM_FIELDS.includes(field.name)
                        ? { localized: true }
                        : {};
                    if (field.name === "confirmationMessage") {
                        return {
                            ...field,
                            ...localized,
                            editor: richTextEditor(["h1", "h2", "h3", "h4"]),
                        };
                    }
                    return { ...field, ...localized };
                }),
        },
    }),
];
