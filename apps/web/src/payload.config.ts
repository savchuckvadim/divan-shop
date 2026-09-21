import { postgresAdapter } from "@payloadcms/db-postgres";
import path from "path";
import { buildConfig, type PayloadRequest } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { getServerSideURL } from "@/modules/shared/lib";

import { Categories, Media, Pages, Products, Users } from "./payload/collections";
import { defaultLexical } from "./payload/fields";
import { Footer, Header, SiteSettings } from "./payload/globals";
import { localization } from "./payload/localization";
import { plugins } from "./payload/plugins";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: { baseDir: path.resolve(dirname) },
        livePreview: {
            breakpoints: [
                { label: "Mobile", name: "mobile", width: 375, height: 667 },
                { label: "Tablet", name: "tablet", width: 768, height: 1024 },
                { label: "Desktop", name: "desktop", width: 1440, height: 900 },
            ],
        },
    },
    localization,
    editor: defaultLexical,
    db: postgresAdapter({
        pool: { connectionString: process.env.DATABASE_URL || "" },
        // Dev pushes the schema automatically; production uses migrations unless PAYLOAD_DB_PUSH=true.
        push: process.env.PAYLOAD_DB_PUSH ? process.env.PAYLOAD_DB_PUSH === "true" : undefined,
    }),
    collections: [Products, Categories, Pages, Media, Users],
    globals: [Header, Footer, SiteSettings],
    cors: [getServerSideURL()].filter(Boolean),
    plugins,
    secret: process.env.PAYLOAD_SECRET,
    sharp,
    typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
    jobs: {
        access: {
            run: ({ req }: { req: PayloadRequest }): boolean => {
                if (req.user) return true;
                const secret = process.env.CRON_SECRET;
                if (!secret) return false;
                return req.headers.get("authorization") === `Bearer ${secret}`;
            },
        },
        tasks: [],
    },
});
