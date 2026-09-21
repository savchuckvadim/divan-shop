import type { MetadataRoute } from "next";

import { absoluteUrl, getServerSideURL } from "@/modules/shared/lib";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/next", "/*/account"] },
        ],
        sitemap: absoluteUrl("/sitemap.xml"),
        host: getServerSideURL(),
    };
}
