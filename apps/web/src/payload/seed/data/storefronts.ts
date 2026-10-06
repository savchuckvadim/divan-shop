import type { Storefront } from "@/payload-types";

import type { Localized } from "./site";

export interface StorefrontSeed {
    key: Storefront["key"];
    domain: string;
    slides: string[];
    cta: NonNullable<Storefront["hero"]>["cta"];
    slogan: Localized<string>;
    heading: Localized<string>;
    text: Localized<string>;
}

/** Home heroes of the three storefronts (presets in ADR-0011); slides are design/concepts assets. */
export const STOREFRONTS_SEED: StorefrontSeed[] = [
    {
        key: "group",
        domain: "divan.group",
        slides: ["interior-01", "interior-02", "interior-03", "interior-10"],
        cta: "catalog",
        slogan: {
            es: "Alicante · Costa Blanca",
            en: "Alicante · Costa Blanca",
            ru: "Аликанте · Коста-Бланка",
            uk: "Аліканте · Коста-Бланка",
        },
        heading: {
            es: "Sofás a medida para tu casa en la Costa Blanca",
            en: "Made-to-order sofas for your home on the Costa Blanca",
            ru: "Диваны на заказ для вашего дома на Коста-Бланке",
            uk: "Дивани на замовлення для вашого дому на Коста-Бланці",
        },
        text: {
            es: "Fabricados en talleres de la Comunidad Valenciana. Muestras de tela gratis por correo, entrega y montaje incluidos.",
            en: "Made in workshops in the Valencian Community. Free fabric samples by post, delivery and assembly included.",
            ru: "Делаем в мастерских Валенсийского сообщества. Образцы тканей бесплатно по почте, доставка и сборка включены.",
            uk: "Виготовляємо в майстернях Валенсійської спільноти. Зразки тканин безкоштовно поштою, доставка і збирання включені.",
        },
    },
    {
        key: "boutique",
        domain: "divan.boutique",
        slides: ["interior-06", "interior-05", "detail-06", "detail-03"],
        cta: "catalog",
        slogan: {
            es: "Colección limitada",
            en: "Limited collection",
            ru: "Лимитированная коллекция",
            uk: "Лімітована колекція",
        },
        heading: {
            es: "Pocos sofás. Elegidos uno a uno.",
            en: "Few sofas. Each one chosen by hand.",
            ru: "Немного диванов. Каждый выбран вручную.",
            uk: "Небагато диванів. Кожен обраний вручну.",
        },
        text: {
            es: "Piezas de autor de talleres valencianos, en piel y tejidos naturales. Asesor personal, muestras a domicilio y entrega con montaje.",
            en: "Signature pieces from Valencian workshops in leather and natural fabrics. A personal advisor, samples at home, delivery with assembly.",
            ru: "Авторские модели валенсийских мастерских в коже и натуральных тканях. Персональный консультант, образцы на дом, доставка со сборкой.",
            uk: "Авторські моделі валенсійських майстерень у шкірі та натуральних тканинах. Персональний консультант, зразки додому, доставка зі збиранням.",
        },
    },
    {
        key: "youth",
        domain: "plof.club",
        slides: ["product-10", "product-08", "product-09", "interior-07"],
        cta: "catalog",
        slogan: {
            es: "Sofás con actitud",
            en: "Sofas with attitude",
            ru: "Диваны с характером",
            uk: "Дивани з характером",
        },
        heading: {
            es: "Tu sofá, tus reglas.",
            en: "Your sofa, your rules.",
            ru: "Твой диван — твои правила.",
            uk: "Твій диван — твої правила.",
        },
        text: {
            es: "Colores que no piden permiso, módulos que cambian contigo y precios para tu primer piso. Entrega y montaje en la Costa Blanca.",
            en: "Colours that don't ask for permission, modules that change with you and prices for your first place. Delivery and assembly on the Costa Blanca.",
            ru: "Цвета, которые не спрашивают разрешения, модули, которые меняются вместе с тобой, и цены для первой своей квартиры. Доставка и сборка по Коста-Бланке.",
            uk: "Кольори, які не питають дозволу, модулі, що змінюються разом із тобою, і ціни для першого власного житла. Доставка і збирання по Коста-Бланці.",
        },
    },
];

/** Alt text for images that are not product photos (those take the product title). */
export const SCENE_ALT: Localized<string> = {
    es: "Salón con un sofá a medida",
    en: "Living room with a made-to-order sofa",
    ru: "Гостиная с диваном на заказ",
    uk: "Вітальня з диваном на замовлення",
};

export const DETAIL_ALT: Localized<string> = {
    es: "Detalle de la tapicería",
    en: "Upholstery detail",
    ru: "Деталь обивки",
    uk: "Деталь оббивки",
};

/** Covers for the seeded articles, by article slug. */
export const ARTICLE_COVERS: Record<string, string> = {
    "como-elegir-sofa": "interior-08",
    "sofa-cama-apertura-italiana-vs-sistema-libro": "interior-04",
};
