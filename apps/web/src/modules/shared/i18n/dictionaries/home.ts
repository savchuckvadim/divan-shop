import type { Locale } from "@/modules/shared/config";

interface TrustItem {
    title: string;
    text: string;
}

export interface HomeDictionary {
    heroEyebrow: string;
    heroTitle: string;
    heroAccent: string;
    heroText: string;
    ctaCatalog: string;
    ctaVisit: string;
    featuredEyebrow: string;
    trust: {
        delivery: TrustItem;
        showroom: TrustItem;
        languages: TrustItem;
    };
}

export const HOME: Record<Locale, HomeDictionary> = {
    ru: {
        heroEyebrow: "Шоурум в Аликанте",
        heroTitle: "Диваны, в которых",
        heroAccent: "хочется жить",
        heroText:
            "Прямые, угловые и модульные модели для домов на Коста-Бланке. Посмотрите вживую в шоуруме в Аликанте — доставим и соберём по всему побережью.",
        ctaCatalog: "Смотреть каталог",
        ctaVisit: "Записаться в шоурум",
        featuredEyebrow: "Из шоурума",
        trust: {
            delivery: {
                title: "Доставка по Коста-Бланке",
                text: "Аликанте, Торревьеха и всё побережье — привезём и соберём.",
            },
            showroom: {
                title: "Шоурум в Аликанте",
                text: "Посидите, потрогайте ткани и получите код на скидку.",
            },
            languages: {
                title: "Говорим на четырёх языках",
                text: "Русский, English, Español, Українська — в шоуруме и по телефону.",
            },
        },
    },
    en: {
        heroEyebrow: "Showroom in Alicante",
        heroTitle: "Sofas you want to",
        heroAccent: "live in",
        heroText:
            "Straight, corner and modular sofas for homes on the Costa Blanca. See them in person at our Alicante showroom — we deliver and assemble along the whole coast.",
        ctaCatalog: "Browse the catalog",
        ctaVisit: "Book a showroom visit",
        featuredEyebrow: "From the showroom",
        trust: {
            delivery: {
                title: "Delivery across the Costa Blanca",
                text: "Alicante, Torrevieja and the whole coast — delivered and assembled.",
            },
            showroom: {
                title: "Showroom in Alicante",
                text: "Sit down, feel the fabrics and pick up a discount code.",
            },
            languages: {
                title: "We speak four languages",
                text: "Русский, English, Español, Українська — in the showroom and by phone.",
            },
        },
    },
    es: {
        heroEyebrow: "Showroom en Alicante",
        heroTitle: "Sofás en los que",
        heroAccent: "apetece vivir",
        heroText:
            "Sofás rectos, de esquina y modulares para casas en la Costa Blanca. Míralos en persona en nuestro showroom de Alicante: entregamos y montamos en toda la costa.",
        ctaCatalog: "Ver el catálogo",
        ctaVisit: "Reservar visita al showroom",
        featuredEyebrow: "Desde el showroom",
        trust: {
            delivery: {
                title: "Entrega en toda la Costa Blanca",
                text: "Alicante, Torrevieja y toda la costa: entrega y montaje.",
            },
            showroom: {
                title: "Showroom en Alicante",
                text: "Siéntate, toca las telas y llévate un código de descuento.",
            },
            languages: {
                title: "Hablamos cuatro idiomas",
                text: "Русский, English, Español, Українська: en el showroom y por teléfono.",
            },
        },
    },
    uk: {
        heroEyebrow: "Шоурум в Аліканте",
        heroTitle: "Дивани, в яких",
        heroAccent: "хочеться жити",
        heroText:
            "Прямі, кутові та модульні моделі для домівок на Коста-Бланці. Подивіться наживо в шоурумі в Аліканте — доставимо та зберемо по всьому узбережжю.",
        ctaCatalog: "Дивитися каталог",
        ctaVisit: "Записатися до шоуруму",
        featuredEyebrow: "З шоуруму",
        trust: {
            delivery: {
                title: "Доставка по Коста-Бланці",
                text: "Аліканте, Торрев'єха та все узбережжя — привеземо та зберемо.",
            },
            showroom: {
                title: "Шоурум в Аліканте",
                text: "Посидьте, торкніться тканин і отримайте код на знижку.",
            },
            languages: {
                title: "Говоримо чотирма мовами",
                text: "Русский, English, Español, Українська — у шоурумі та телефоном.",
            },
        },
    },
};
