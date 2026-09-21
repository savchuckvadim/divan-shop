import type { Locale } from "@/modules/shared/config";

export interface ProductDictionary {
    price: string;
    oldPrice: string;
    availability: {
        inStock: string;
        onRequest: string;
        outOfStock: string;
    };
    specsTitle: string;
    specs: {
        width: string;
        depth: string;
        height: string;
        sleepingWidth: string;
        material: string;
        mechanism: string;
        color: string;
    };
    materials: {
        fabric: string;
        leather: string;
        ecoLeather: string;
        velour: string;
    };
    mechanisms: {
        none: string;
        eurobook: string;
        accordion: string;
        dolphin: string;
        clickClack: string;
    };
    cm: string;
    description: string;
    related: string;
    requestQuote: string;
}

export const PRODUCT: Record<Locale, ProductDictionary> = {
    ru: {
        price: "Цена",
        oldPrice: "Старая цена",
        availability: { inStock: "В наличии", onRequest: "Под заказ", outOfStock: "Нет в наличии" },
        specsTitle: "Характеристики",
        specs: {
            width: "Ширина",
            depth: "Глубина",
            height: "Высота",
            sleepingWidth: "Спальное место",
            material: "Материал",
            mechanism: "Механизм",
            color: "Цвет",
        },
        materials: { fabric: "Ткань", leather: "Кожа", ecoLeather: "Экокожа", velour: "Велюр" },
        mechanisms: {
            none: "Без механизма",
            eurobook: "Еврокнижка",
            accordion: "Аккордеон",
            dolphin: "Дельфин",
            clickClack: "Клик-кляк",
        },
        cm: "см",
        description: "Описание",
        related: "Похожие модели",
        requestQuote: "Узнать цену и сроки",
    },
    en: {
        price: "Price",
        oldPrice: "Old price",
        availability: {
            inStock: "In stock",
            onRequest: "Made to order",
            outOfStock: "Out of stock",
        },
        specsTitle: "Specifications",
        specs: {
            width: "Width",
            depth: "Depth",
            height: "Height",
            sleepingWidth: "Sleeping area",
            material: "Material",
            mechanism: "Mechanism",
            color: "Color",
        },
        materials: {
            fabric: "Fabric",
            leather: "Leather",
            ecoLeather: "Eco leather",
            velour: "Velour",
        },
        mechanisms: {
            none: "No mechanism",
            eurobook: "Eurobook",
            accordion: "Accordion",
            dolphin: "Dolphin",
            clickClack: "Click-clack",
        },
        cm: "cm",
        description: "Description",
        related: "Similar models",
        requestQuote: "Get price and lead time",
    },
    es: {
        price: "Precio",
        oldPrice: "Precio anterior",
        availability: { inStock: "En stock", onRequest: "Bajo pedido", outOfStock: "Agotado" },
        specsTitle: "Características",
        specs: {
            width: "Ancho",
            depth: "Profundidad",
            height: "Alto",
            sleepingWidth: "Zona de descanso",
            material: "Material",
            mechanism: "Mecanismo",
            color: "Color",
        },
        materials: {
            fabric: "Tela",
            leather: "Cuero",
            ecoLeather: "Ecocuero",
            velour: "Terciopelo",
        },
        mechanisms: {
            none: "Sin mecanismo",
            eurobook: "Eurolibro",
            accordion: "Acordeón",
            dolphin: "Delfín",
            clickClack: "Clic-clac",
        },
        cm: "cm",
        description: "Descripción",
        related: "Modelos similares",
        requestQuote: "Consultar precio y plazo",
    },
    uk: {
        price: "Ціна",
        oldPrice: "Стара ціна",
        availability: {
            inStock: "В наявності",
            onRequest: "Під замовлення",
            outOfStock: "Немає в наявності",
        },
        specsTitle: "Характеристики",
        specs: {
            width: "Ширина",
            depth: "Глибина",
            height: "Висота",
            sleepingWidth: "Спальне місце",
            material: "Матеріал",
            mechanism: "Механізм",
            color: "Колір",
        },
        materials: { fabric: "Тканина", leather: "Шкіра", ecoLeather: "Екошкіра", velour: "Велюр" },
        mechanisms: {
            none: "Без механізму",
            eurobook: "Єврокнижка",
            accordion: "Акордеон",
            dolphin: "Дельфін",
            clickClack: "Клік-кляк",
        },
        cm: "см",
        description: "Опис",
        related: "Схожі моделі",
        requestQuote: "Дізнатися ціну та терміни",
    },
};
