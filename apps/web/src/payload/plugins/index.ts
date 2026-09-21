import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { seoPlugin } from "@payloadcms/plugin-seo";
import type { GenerateTitle, GenerateURL } from "@payloadcms/plugin-seo/types";
import type { Plugin } from "payload";

import { DEFAULT_LOCALE, isLocale, ROUTES, SITE } from "@/modules/shared/config";
import { getServerSideURL } from "@/modules/shared/lib";
import type { Page, Product } from "@/payload-types";

import { richTextEditor } from "../fields";
import { revalidateRedirects } from "../hooks";

const generateTitle: GenerateTitle<Page | Product> = ({ doc }) =>
    doc?.title ? `${doc.title} | ${SITE.name}` : SITE.name;

const generateURL: GenerateURL<Page | Product> = ({ doc, collectionSlug, locale }) => {
    const base = getServerSideURL();
    const resolvedLocale = isLocale(locale) ? locale : DEFAULT_LOCALE;
    if (!doc?.slug) return base;
    const path =
        collectionSlug === "products"
            ? ROUTES.product(resolvedLocale, doc.slug)
            : ROUTES.page(resolvedLocale, doc.slug);
    return `${base}${path}`;
};

export const plugins: Plugin[] = [
    redirectsPlugin({
        collections: ["pages", "products"],
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
                defaultFields.map((field) =>
                    "name" in field && field.name === "confirmationMessage"
                        ? { ...field, editor: richTextEditor(["h1", "h2", "h3", "h4"]) }
                        : field
                ),
        },
    }),
];
