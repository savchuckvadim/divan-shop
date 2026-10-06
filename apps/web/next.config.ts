import type { NextConfig } from "next";

import { withPayload } from "@payloadcms/next/withPayload";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

const serverUrl = new URL(SERVER_URL);

// One codebase, several storefronts: the build for a domain picks its fonts (see packages/themes).
const STOREFRONTS = ["group", "boutique", "youth"];
const storefront =
    STOREFRONTS.find((name) => name === process.env.NEXT_PUBLIC_STOREFRONT) ?? "group";
const storefrontFonts = `./src/modules/shared/ui/fonts/${storefront}.ts`;

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: "standalone",
    agentRules: false,
    transpilePackages: ["@workspace/ui", "@workspace/themes"],
    sassOptions: {
        loadPaths: ["./node_modules/@payloadcms/ui/dist/scss/"],
    },
    images: {
        localPatterns: [{ pathname: "/api/media/file/**" }],
        qualities: [75, 90, 100],
        remotePatterns: [
            {
                hostname: serverUrl.hostname,
                protocol: serverUrl.protocol.replace(":", "") as "http" | "https",
            },
        ],
    },
    // One database, one admin: editors work on the group domain, other storefronts do not expose it.
    redirects: async () =>
        storefront === "group"
            ? []
            : [{ source: "/admin/:path*", destination: "/", permanent: false }],
    webpack: (webpackConfig) => {
        webpackConfig.resolve.extensionAlias = {
            ".cjs": [".cts", ".cjs"],
            ".js": [".ts", ".tsx", ".js", ".jsx"],
            ".mjs": [".mts", ".mjs"],
        };
        webpackConfig.resolve.alias = {
            ...webpackConfig.resolve.alias,
            "@storefront/fonts": path.resolve(dirname, storefrontFonts),
        };
        return webpackConfig;
    },
    turbopack: {
        root: path.resolve(dirname, "../.."),
        resolveAlias: {
            "@storefront/fonts": storefrontFonts,
        },
    },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
