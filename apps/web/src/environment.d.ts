declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PAYLOAD_SECRET: string;
            DATABASE_URL: string;
            NEXT_PUBLIC_SERVER_URL: string;
            NEXT_PUBLIC_BRAND_NAME?: string;
            /** group | boutique | youth; picked at build time (ADR-0011). */
            NEXT_PUBLIC_STOREFRONT?: string;
            VERCEL_PROJECT_PRODUCTION_URL: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
