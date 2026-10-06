// next.config.ts aliases this to ./<NEXT_PUBLIC_STOREFRONT>.ts at build time, so each site bundles
// and preloads only its own fonts.
declare module "@storefront/fonts" {
    export const fontVariables: string;
}
