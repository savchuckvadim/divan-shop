import type { NextConfig } from "next";

import { withPayload } from "@payloadcms/next/withPayload";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

const serverUrl = new URL(SERVER_URL);

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: "standalone",
    agentRules: false,
    transpilePackages: ["@workspace/ui"],
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
    webpack: (webpackConfig) => {
        webpackConfig.resolve.extensionAlias = {
            ".cjs": [".cts", ".cjs"],
            ".js": [".ts", ".tsx", ".js", ".jsx"],
            ".mjs": [".mts", ".mjs"],
        };
        return webpackConfig;
    },
    turbopack: {
        root: path.resolve(dirname, "../.."),
    },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
