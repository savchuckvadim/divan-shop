import type { MetadataRoute } from "next";

import { STOREFRONT_INDEXED } from "@/modules/shared/config";
import { absoluteUrl, getServerSideURL } from "@/modules/shared/lib";

/** Built from CMS data, so it is generated per request (no database during docker build). */
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/next", "/*/account"] },
        ],
        ...(STOREFRONT_INDEXED ? { sitemap: absoluteUrl("/sitemap.xml") } : {}),
        host: getServerSideURL(),
    };
}
