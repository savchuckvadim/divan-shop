import { BRAND_NAME, type Locale } from "@/modules/shared/config";

export interface OgDictionary {
    /** Alt text for the generated link-preview image. */
    imageAlt: string;
    /** Eyebrow on the catalog card. */
    catalogEyebrow: string;
    /** Eyebrow on the blog index and article cards. */
    blogEyebrow: string;
}

export const OG: Record<Locale, OgDictionary> = {
    ru: {
        imageAlt: `${BRAND_NAME} — превью страницы`,
        catalogEyebrow: "Каталог",
        blogEyebrow: "Блог",
    },
    en: {
        imageAlt: `${BRAND_NAME} — page preview`,
        catalogEyebrow: "Catalog",
        blogEyebrow: "Blog",
    },
    es: {
        imageAlt: `${BRAND_NAME} — vista previa de la página`,
        catalogEyebrow: "Catálogo",
        blogEyebrow: "Blog",
    },
    uk: {
        imageAlt: `${BRAND_NAME} — прев'ю сторінки`,
        catalogEyebrow: "Каталог",
        blogEyebrow: "Блог",
    },
};
