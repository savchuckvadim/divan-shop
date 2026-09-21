import { notFound, redirect } from "next/navigation";

import { getCachedRedirects } from "@/modules/shared/api";
import type { Locale } from "@/modules/shared/config";
import { type CmsLinkCollection, hrefForDoc } from "@/modules/shared/lib";

interface PayloadRedirectsProps {
    url: string;
    locale: Locale;
    disableNotFound?: boolean;
}

/**
 * Server-side dynamic redirects managed in the CMS. `url` is the path without the
 * locale prefix, so one redirect rule applies to every language.
 */
export const PayloadRedirects = async ({ url, locale, disableNotFound }: PayloadRedirectsProps) => {
    const redirects = await getCachedRedirects()();
    const match = redirects.find((item) => item.from === url);

    if (match) {
        if (match.to?.url) {
            redirect(match.to.url);
        }

        const reference = match.to?.reference;
        if (reference && typeof reference.value === "object" && reference.value.slug) {
            redirect(
                hrefForDoc(reference.relationTo as CmsLinkCollection, reference.value.slug, locale)
            );
        }
    }

    if (disableNotFound) return null;

    notFound();
};
