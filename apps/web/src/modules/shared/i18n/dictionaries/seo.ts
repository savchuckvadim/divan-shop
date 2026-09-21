import { BRAND_NAME, type Locale } from "@/modules/shared/config";

export interface SeoDictionary {
    defaultTitle: string;
    defaultDescription: string;
    titleTemplate: string;
    catalogTitle: string;
    catalogDescription: string;
    productTitle: string;
    productDescription: string;
    categoryTitle: string;
}

export const SEO: Record<Locale, SeoDictionary> = {
    ru: {
        defaultTitle: `${BRAND_NAME} — диваны с доставкой`,
        defaultDescription:
            "Магазин диванов: прямые, угловые и модульные модели. Доставка, гарантия, помощь в подборе.",
        titleTemplate: `{title} | ${BRAND_NAME}`,
        catalogTitle: "Каталог диванов — купить диван с доставкой",
        catalogDescription:
            "Все модели диванов в одном каталоге: цены, размеры, материалы. Выберите свой диван.",
        productTitle: "{title} — купить диван",
        productDescription: "{title}: цена, размеры, материалы и механизм. Закажите с доставкой.",
        categoryTitle: "{title} — каталог диванов",
    },
    en: {
        defaultTitle: `${BRAND_NAME} — sofas with delivery`,
        defaultDescription:
            "Sofa store: straight, corner and modular models. Delivery, warranty, help choosing.",
        titleTemplate: `{title} | ${BRAND_NAME}`,
        catalogTitle: "Sofa catalog — buy a sofa with delivery",
        catalogDescription: "All sofa models in one catalog: prices, sizes, materials. Pick yours.",
        productTitle: "{title} — buy sofa",
        productDescription:
            "{title}: price, dimensions, materials and mechanism. Order with delivery.",
        categoryTitle: "{title} — sofa catalog",
    },
    es: {
        defaultTitle: `${BRAND_NAME} — sofás con entrega`,
        defaultDescription:
            "Tienda de sofás: modelos rectos, de esquina y modulares. Entrega, garantía, asesoramiento.",
        titleTemplate: `{title} | ${BRAND_NAME}`,
        catalogTitle: "Catálogo de sofás — comprar sofá con entrega",
        catalogDescription:
            "Todos los modelos de sofás en un catálogo: precios, medidas, materiales. Elige el tuyo.",
        productTitle: "{title} — comprar sofá",
        productDescription: "{title}: precio, medidas, materiales y mecanismo. Pide con entrega.",
        categoryTitle: "{title} — catálogo de sofás",
    },
    uk: {
        defaultTitle: `${BRAND_NAME} — дивани з доставкою`,
        defaultDescription:
            "Магазин диванів: прямі, кутові та модульні моделі. Доставка, гарантія, допомога з вибором.",
        titleTemplate: `{title} | ${BRAND_NAME}`,
        catalogTitle: "Каталог диванів — купити диван з доставкою",
        catalogDescription:
            "Усі моделі диванів в одному каталозі: ціни, розміри, матеріали. Оберіть свій диван.",
        productTitle: "{title} — купити диван",
        productDescription: "{title}: ціна, розміри, матеріали та механізм. Замовте з доставкою.",
        categoryTitle: "{title} — каталог диванів",
    },
};
