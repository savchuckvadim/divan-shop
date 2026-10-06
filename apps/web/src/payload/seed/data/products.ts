import type { Product } from "@/payload-types";

import type { Localized } from "./site";

type Specs = NonNullable<Product["specs"]>;

export interface ProductSeed {
    slug: string;
    category: string;
    /** Asset ids from design/concepts/assets; the first is the cover. */
    images: string[];
    price: number;
    oldPrice?: number;
    availability: Product["availability"];
    featured?: boolean;
    specs: Omit<Specs, "color">;
    title: Localized<string>;
    color: Localized<string>;
}

/** Demo catalogue: photos from the design prototypes (Unsplash, see design/concepts/assets/CREDITS.md). */
export const PRODUCTS_SEED: ProductSeed[] = [
    {
        slug: "sillon-giratorio-altea",
        category: "sillones-relax",
        images: ["product-01", "detail-01"],
        price: 690,
        availability: "inStock",
        featured: true,
        specs: { width: 86, depth: 82, height: 74, material: "fabric", mechanism: "none" },
        title: {
            es: "Sillón giratorio Altea",
            en: "Altea swivel armchair",
            ru: "Вращающееся кресло Altea",
            uk: "Обертове крісло Altea",
        },
        color: {
            es: "Bouclé crema",
            en: "Cream bouclé",
            ru: "Кремовый букле",
            uk: "Кремовий букле",
        },
    },
    {
        slug: "butaca-calpe",
        category: "sillones-relax",
        images: ["product-02", "detail-02"],
        price: 540,
        availability: "onRequest",
        specs: { width: 72, depth: 78, height: 84, material: "fabric", mechanism: "none" },
        title: {
            es: "Butaca Calpe",
            en: "Calpe armchair",
            ru: "Кресло Calpe",
            uk: "Крісло Calpe",
        },
        color: { es: "Blanco roto", en: "Off-white", ru: "Молочный", uk: "Молочний" },
    },
    {
        slug: "sofa-javea-2-plazas",
        category: "sofas-2-plazas",
        images: ["product-03", "detail-03"],
        price: 1290,
        oldPrice: 1490,
        availability: "inStock",
        featured: true,
        specs: { width: 168, depth: 88, height: 86, material: "velour", mechanism: "none" },
        title: {
            es: "Sofá Jávea 2 plazas",
            en: "Jávea 2-seater sofa",
            ru: "Двухместный диван Jávea",
            uk: "Двомісний диван Jávea",
        },
        color: { es: "Topo", en: "Taupe", ru: "Тауп", uk: "Тауп" },
    },
    {
        slug: "chaise-longue-denia",
        category: "chaise-longue",
        images: ["product-04", "detail-04"],
        price: 1390,
        availability: "inStock",
        specs: { width: 196, depth: 96, height: 78, material: "fabric", mechanism: "none" },
        title: {
            es: "Chaise longue Dénia",
            en: "Dénia chaise longue",
            ru: "Шезлонг Dénia",
            uk: "Шезлонг Dénia",
        },
        color: { es: "Terracota", en: "Terracotta", ru: "Терракота", uk: "Теракота" },
    },
    {
        slug: "sofa-curvo-moraira",
        category: "sofas-3-plazas",
        images: ["product-05", "detail-02"],
        price: 2190,
        availability: "onRequest",
        featured: true,
        specs: { width: 240, depth: 104, height: 76, material: "fabric", mechanism: "none" },
        title: {
            es: "Sofá curvo Moraira",
            en: "Moraira curved sofa",
            ru: "Изогнутый диван Moraira",
            uk: "Вигнутий диван Moraira",
        },
        color: { es: "Arena", en: "Sand", ru: "Песочный", uk: "Пісочний" },
    },
    {
        slug: "sofa-benissa-3-plazas",
        category: "sofas-3-plazas",
        images: ["product-06", "detail-04"],
        price: 1690,
        oldPrice: 1890,
        availability: "inStock",
        featured: true,
        specs: { width: 214, depth: 92, height: 84, material: "velour", mechanism: "none" },
        title: {
            es: "Sofá Benissa 3 plazas",
            en: "Benissa 3-seater sofa",
            ru: "Трёхместный диван Benissa",
            uk: "Тримісний диван Benissa",
        },
        color: {
            es: "Verde botella",
            en: "Bottle green",
            ru: "Бутылочный зелёный",
            uk: "Пляшковий зелений",
        },
    },
    {
        slug: "sofa-teulada-3-plazas",
        category: "sofas-3-plazas",
        images: ["product-07", "detail-03"],
        price: 1590,
        availability: "inStock",
        specs: { width: 214, depth: 92, height: 84, material: "velour", mechanism: "none" },
        title: {
            es: "Sofá Teulada 3 plazas",
            en: "Teulada 3-seater sofa",
            ru: "Трёхместный диван Teulada",
            uk: "Тримісний диван Teulada",
        },
        color: {
            es: "Negro carbón",
            en: "Charcoal black",
            ru: "Угольно-чёрный",
            uk: "Вугільно-чорний",
        },
    },
    {
        slug: "modular-orihuela",
        category: "modulares",
        images: ["product-08", "interior-02"],
        price: 3280,
        availability: "onRequest",
        featured: true,
        specs: { width: 320, depth: 180, height: 62, material: "fabric", mechanism: "none" },
        title: {
            es: "Sofá modular Orihuela",
            en: "Orihuela modular sofa",
            ru: "Модульный диван Orihuela",
            uk: "Модульний диван Orihuela",
        },
        color: { es: "Verde oliva", en: "Olive green", ru: "Оливковый", uk: "Оливковий" },
    },
    {
        slug: "sofa-curvo-elche",
        category: "sofas-2-plazas",
        images: ["product-09", "detail-03"],
        price: 1890,
        availability: "inStock",
        specs: { width: 190, depth: 100, height: 78, material: "velour", mechanism: "none" },
        title: {
            es: "Sofá curvo Elche",
            en: "Elche curved sofa",
            ru: "Изогнутый диван Elche",
            uk: "Вигнутий диван Elche",
        },
        color: { es: "Azul petróleo", en: "Petrol blue", ru: "Петроль", uk: "Петроль" },
    },
    {
        slug: "modular-santa-pola",
        category: "modulares",
        images: ["product-10", "interior-07"],
        price: 2990,
        availability: "onRequest",
        specs: { width: 330, depth: 110, height: 72, material: "fabric", mechanism: "none" },
        title: {
            es: "Sofá modular Santa Pola",
            en: "Santa Pola modular sofa",
            ru: "Модульный диван Santa Pola",
            uk: "Модульний диван Santa Pola",
        },
        color: { es: "Melocotón", en: "Peach", ru: "Персиковый", uk: "Персиковий" },
    },
    {
        slug: "sofa-villajoyosa-piel",
        category: "sofas-piel",
        images: ["product-11", "detail-06"],
        price: 2490,
        oldPrice: 2790,
        availability: "inStock",
        featured: true,
        specs: { width: 196, depth: 94, height: 80, material: "leather", mechanism: "none" },
        title: {
            es: "Sofá de piel Villajoyosa",
            en: "Villajoyosa leather sofa",
            ru: "Кожаный диван Villajoyosa",
            uk: "Шкіряний диван Villajoyosa",
        },
        color: { es: "Coñac", en: "Cognac", ru: "Коньячный", uk: "Коньячний" },
    },
    {
        slug: "sillon-guardamar-piel",
        category: "sofas-piel",
        images: ["product-12", "detail-06"],
        price: 1190,
        availability: "outOfStock",
        specs: { width: 98, depth: 90, height: 78, material: "leather", mechanism: "none" },
        title: {
            es: "Sillón de piel Guardamar",
            en: "Guardamar leather armchair",
            ru: "Кожаное кресло Guardamar",
            uk: "Шкіряне крісло Guardamar",
        },
        color: { es: "Camel", en: "Camel", ru: "Кэмел", uk: "Кемел" },
    },
];

const MATERIAL: Record<NonNullable<Specs["material"]>, Localized<string>> = {
    fabric: { es: "tela", en: "fabric", ru: "ткань", uk: "тканина" },
    leather: {
        es: "piel natural",
        en: "genuine leather",
        ru: "натуральная кожа",
        uk: "натуральна шкіра",
    },
    ecoLeather: { es: "polipiel", en: "faux leather", ru: "экокожа", uk: "екошкіра" },
    velour: { es: "terciopelo", en: "velvet", ru: "велюр", uk: "велюр" },
};

/** Two short paragraphs per locale: what it is, then how it is made and delivered. */
export const productDescription = (product: ProductSeed): Localized<string[]> => {
    const { width, depth, height, material } = product.specs;
    const size = `${width} × ${depth} × ${height}`;
    const fabric = (locale: keyof Localized<string>) =>
        material ? MATERIAL[material][locale] : MATERIAL.fabric[locale];
    return {
        es: [
            `${product.title.es}, ${product.color.es.toLowerCase()}, en ${fabric("es")}. Medidas ${size} cm.`,
            "Fabricado bajo pedido en un taller de la Comunidad Valenciana. Te enviamos muestras de tela gratis por correo; la entrega y el montaje en la Costa Blanca están incluidos.",
        ],
        en: [
            `${product.title.en}, ${product.color.en.toLowerCase()}, in ${fabric("en")}. Size ${size} cm.`,
            "Made to order in a workshop in the Valencian Community. We post free fabric samples; delivery and assembly on the Costa Blanca are included.",
        ],
        ru: [
            `${product.title.ru}, цвет «${product.color.ru.toLowerCase()}», ${fabric("ru")}. Размеры ${size} см.`,
            "Изготавливаем под заказ в мастерской Валенсийского сообщества. Бесплатно пришлём образцы тканей по почте; доставка и сборка по Коста-Бланке включены.",
        ],
        uk: [
            `${product.title.uk}, колір «${product.color.uk.toLowerCase()}», ${fabric("uk")}. Розміри ${size} см.`,
            "Виготовляємо під замовлення в майстерні Валенсійської спільноти. Безкоштовно надішлемо зразки тканин поштою; доставка і збирання по Коста-Бланці включені.",
        ],
    };
};
