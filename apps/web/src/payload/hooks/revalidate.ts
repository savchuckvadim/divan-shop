import { revalidatePath, revalidateTag } from "next/cache";

import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
    GlobalAfterChangeHook,
    TypeWithID,
} from "payload";

import { type Locale, LOCALES } from "@/modules/shared/config";

type PathBuilder = (locale: Locale, slug: string) => string;

interface SluggedDoc {
    slug?: string | null;
    _status?: ("draft" | "published") | null;
}

const revalidateAllLocales = (buildPath: PathBuilder, slug: string, tag: string) => {
    for (const locale of LOCALES) {
        revalidatePath(buildPath(locale, slug));
    }
    revalidateTag(tag, "max");
};

export const createRevalidateHooks = <T extends TypeWithID & SluggedDoc>(
    buildPath: PathBuilder,
    tag: string
) => {
    const afterChange: CollectionAfterChangeHook<T> = ({ doc, previousDoc, req }) => {
        if (req.context.disableRevalidate) return doc;

        if (doc._status === "published" && doc.slug) {
            req.payload.logger.info(`Revalidating ${tag}: ${doc.slug}`);
            revalidateAllLocales(buildPath, doc.slug, tag);
        }

        if (
            previousDoc?._status === "published" &&
            doc._status !== "published" &&
            previousDoc.slug
        ) {
            revalidateAllLocales(buildPath, previousDoc.slug, tag);
        }

        return doc;
    };

    const afterDelete: CollectionAfterDeleteHook<T> = ({ doc, req }) => {
        if (!req.context.disableRevalidate && doc?.slug) {
            revalidateAllLocales(buildPath, doc.slug, tag);
        }
        return doc;
    };

    return { afterChange, afterDelete };
};

export const createRevalidateGlobalHook =
    (tag: string): GlobalAfterChangeHook =>
    ({ doc, req }) => {
        if (!req.context.disableRevalidate) {
            req.payload.logger.info(`Revalidating ${tag}`);
            revalidateTag(tag, "max");
        }
        return doc;
    };

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req }) => {
    req.payload.logger.info("Revalidating redirects");
    revalidateTag("redirects", "max");
    return doc;
};
