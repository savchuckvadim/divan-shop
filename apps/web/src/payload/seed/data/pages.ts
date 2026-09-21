import { BRAND_NAME, type Locale, ROUTES } from "@/modules/shared/config";
import type { Page } from "@/payload-types";

import { richText, type RichTextInput } from "../lexical";
import { type Localized, NAV_LABELS, SITE_SEED } from "./site";

type LayoutBlock = Page["layout"][number];

export interface PageLocaleData {
    title: string;
    hero: Page["hero"];
    layout: LayoutBlock[];
    meta: { title: string; description: string };
}

interface PageRefs {
    contactsPageId?: number;
    formId?: number;
}

const HOME = {
    title: { es: "Inicio", en: "Home", ru: "Главная", uk: "Головна" },
    h1: {
        es: "Tienda de sofás en Alicante",
        en: "Sofa store in Alicante",
        ru: "Диваны в Аликанте, Испания",
        uk: "Дивани в Аліканте, Іспанія",
    },
    intro: {
        es: "Sofás chaise longue, rinconeras, sofás cama y relax con entrega en toda la Costa Blanca. Te atendemos en español, inglés, ruso y ucraniano.",
        en: "Chaise longue, corner, sofa bed and recliner sofas with delivery across the Costa Blanca. We speak English, Spanish, Russian and Ukrainian.",
        ru: "Диваны с шезлонгом, угловые, диваны-кровати и реклайнеры с доставкой по всей Коста-Бланке. Говорим по-русски, по-испански, по-английски и по-украински.",
        uk: "Дивани з шезлонгом, кутові, дивани-ліжка та реклайнери з доставкою по всій Коста-Бланці. Говоримо українською, іспанською, англійською та російською.",
    },
    catalogCta: {
        es: "Ver catálogo",
        en: "Browse the catalog",
        ru: "Смотреть каталог",
        uk: "Дивитися каталог",
    },
    featured: {
        es: "Modelos populares",
        en: "Popular models",
        ru: "Популярные модели",
        uk: "Популярні моделі",
    },
    faqTitle: {
        es: "Preguntas frecuentes",
        en: "Frequently asked questions",
        ru: "Частые вопросы",
        uk: "Часті запитання",
    },
    faq: [
        {
            q: {
                es: "¿Hacéis entrega a domicilio en Alicante y Torrevieja?",
                en: "Do you deliver to homes in Alicante and Torrevieja?",
                ru: "Доставляете ли вы на дом в Аликанте и Торревьехе?",
                uk: "Чи доставляєте ви додому в Аліканте та Торрев'єсі?",
            },
            a: {
                es: "Sí. Entregamos y montamos en Alicante, Torrevieja, Orihuela Costa, Elche, Benidorm y toda la Costa Blanca. Los modelos en stock se entregan en 2–5 días laborables.",
                en: "Yes. We deliver and assemble in Alicante, Torrevieja, Orihuela Costa, Elche, Benidorm and across the Costa Blanca. Models in stock are delivered within 2–5 working days.",
                ru: "Да. Доставляем и собираем в Аликанте, Торревьехе, Ориуэла-Коста, Эльче, Бенидорме и по всей Коста-Бланке. Модели в наличии доставляем за 2–5 рабочих дней.",
                uk: "Так. Доставляємо та збираємо в Аліканте, Торрев'єсі, Оріуела-Коста, Ельче, Бенідормі та по всій Коста-Бланці. Моделі в наявності доставляємо за 2–5 робочих днів.",
            },
        },
        {
            q: {
                es: "¿Dónde puedo ver los sofás en persona?",
                en: "Where can I see the sofas in person?",
                ru: "Где можно посмотреть диваны вживую?",
                uk: "Де можна побачити дивани наживо?",
            },
            a: {
                es: `En nuestra exposición de Alicante, ${SITE_SEED.workingHours.es}. Escríbenos antes de venir y te reservamos el modelo que te interesa.`,
                en: `In our Alicante showroom, ${SITE_SEED.workingHours.en}. Message us before you come and we will have the model you are interested in ready.`,
                ru: `В нашем шоуруме в Аликанте, ${SITE_SEED.workingHours.ru}. Напишите нам перед визитом, и мы подготовим интересующую модель.`,
                uk: `У нашому шоурумі в Аліканте, ${SITE_SEED.workingHours.uk}. Напишіть нам перед візитом, і ми підготуємо модель, що вас цікавить.`,
            },
        },
        {
            q: {
                es: "¿En qué idiomas atendéis?",
                en: "Which languages do you speak?",
                ru: "На каких языках вы обслуживаете?",
                uk: "Якими мовами ви обслуговуєте?",
            },
            a: {
                es: "Español, inglés, ruso y ucraniano, tanto en tienda como por WhatsApp y teléfono.",
                en: "Spanish, English, Russian and Ukrainian, in the store as well as on WhatsApp and by phone.",
                ru: "Русский, испанский, английский и украинский — в магазине, в WhatsApp и по телефону.",
                uk: "Українська, іспанська, англійська та російська — у магазині, у WhatsApp і по телефону.",
            },
        },
        {
            q: {
                es: "¿Qué garantía tienen los sofás?",
                en: "What warranty do the sofas have?",
                ru: "Какая гарантия на диваны?",
                uk: "Яка гарантія на дивани?",
            },
            a: {
                es: "Garantía legal de 3 años en toda España; en estructura y mecanismos, la mayoría de fabricantes amplían hasta 5 años.",
                en: "The legal 3-year warranty applies across Spain; on frames and mechanisms most manufacturers extend it to 5 years.",
                ru: "Законная гарантия 3 года по всей Испании; на каркас и механизмы большинство производителей дают до 5 лет.",
                uk: "Законна гарантія 3 роки по всій Іспанії; на каркас і механізми більшість виробників дають до 5 років.",
            },
        },
    ],
    ctaText: {
        es: "¿No encuentras tu sofá? Cuéntanos qué buscas y te proponemos opciones a medida.",
        en: "Can't find your sofa? Tell us what you need and we will propose made-to-measure options.",
        ru: "Не нашли свой диван? Расскажите, что ищете, и мы предложим варианты под заказ.",
        uk: "Не знайшли свій диван? Розкажіть, що шукаєте, і ми запропонуємо варіанти під замовлення.",
    },
    ctaButton: {
        es: "Contactar con un asesor",
        en: "Contact a manager",
        ru: "Связаться с менеджером",
        uk: "Зв'язатися з менеджером",
    },
    metaTitle: {
        es: "Tienda de sofás en Alicante",
        en: "Sofa store in Alicante",
        ru: "Диваны в Аликанте, Испания",
        uk: "Дивани в Аліканте, Іспанія",
    },
    metaDescription: {
        es: "Sofás chaise longue, rinconeras, sofás cama y relax en Alicante. Exposición física, entrega en la Costa Blanca, atención en 4 idiomas.",
        en: "Chaise longue, corner, sofa bed and recliner sofas in Alicante. Physical showroom, delivery across the Costa Blanca, service in 4 languages.",
        ru: "Диваны с шезлонгом, угловые, диваны-кровати и реклайнеры в Аликанте. Шоурум, доставка по Коста-Бланке, обслуживание на 4 языках.",
        uk: "Дивани з шезлонгом, кутові, дивани-ліжка та реклайнери в Аліканте. Шоурум, доставка по Коста-Бланці, обслуговування 4 мовами.",
    },
};

const ABOUT = {
    h1: NAV_LABELS.about,
    intro: {
        es: "Una tienda de sofás con exposición en Alicante, pensada para quienes acaban de llegar a la Costa Blanca y para quienes llevan toda la vida aquí.",
        en: "A sofa store with a showroom in Alicante, built for people who have just arrived on the Costa Blanca and for those who have lived here all their lives.",
        ru: "Магазин диванов с шоурумом в Аликанте — для тех, кто только переехал на Коста-Бланку, и для тех, кто живёт здесь всю жизнь.",
        uk: "Магазин диванів із шоурумом в Аліканте — для тих, хто щойно переїхав на Коста-Бланку, і для тих, хто живе тут усе життя.",
    },
    col1: {
        es: [
            { h: "h2", text: "Qué hacemos" },
            "Seleccionamos sofás de fabricantes españoles y europeos: chaise longue, rinconeras, sofás cama, relax y modulares. Todos los modelos de la exposición se pueden probar, medir y pedir en la tela o piel que elijas.",
        ],
        en: [
            { h: "h2", text: "What we do" },
            "We select sofas from Spanish and European manufacturers: chaise longue, corner, sofa bed, recliner and modular. Every model in the showroom can be tried, measured and ordered in the fabric or leather of your choice.",
        ],
        ru: [
            { h: "h2", text: "Что мы делаем" },
            "Мы отбираем диваны испанских и европейских фабрик: с шезлонгом, угловые, диваны-кровати, реклайнеры и модульные. Каждую модель в шоуруме можно попробовать, измерить и заказать в нужной ткани или коже.",
        ],
        uk: [
            { h: "h2", text: "Що ми робимо" },
            "Ми відбираємо дивани іспанських та європейських фабрик: із шезлонгом, кутові, дивани-ліжка, реклайнери та модульні. Кожну модель у шоурумі можна спробувати, виміряти та замовити в потрібній тканині чи шкірі.",
        ],
    } satisfies Localized<RichTextInput[]>,
    col2: {
        es: [
            { h: "h2", text: "Cómo trabajamos" },
            "Te atendemos en español, inglés, ruso y ucraniano. Entregamos y montamos en toda la provincia, retiramos el sofá antiguo y ayudamos a amueblar apartamentos de alquiler y obra nueva con paquetes cerrados.",
        ],
        en: [
            { h: "h2", text: "How we work" },
            "We serve you in English, Spanish, Russian and Ukrainian. We deliver and assemble across the province, take away your old sofa and help furnish rental and new-build apartments with fixed-price packages.",
        ],
        ru: [
            { h: "h2", text: "Как мы работаем" },
            "Обслуживаем на русском, испанском, английском и украинском. Доставляем и собираем по всей провинции, вывозим старый диван и помогаем обставить апартаменты под аренду и новостройки готовыми пакетами.",
        ],
        uk: [
            { h: "h2", text: "Як ми працюємо" },
            "Обслуговуємо українською, іспанською, англійською та російською. Доставляємо та збираємо по всій провінції, вивозимо старий диван і допомагаємо обставити апартаменти під оренду та новобудови готовими пакетами.",
        ],
    } satisfies Localized<RichTextInput[]>,
    metaDescription: {
        es: "Quiénes somos: tienda de sofás con exposición en Alicante, entrega en la Costa Blanca y atención en 4 idiomas.",
        en: "Who we are: a sofa store with a showroom in Alicante, delivery across the Costa Blanca and service in 4 languages.",
        ru: "О нас: магазин диванов с шоурумом в Аликанте, доставка по Коста-Бланке и обслуживание на 4 языках.",
        uk: "Про нас: магазин диванів із шоурумом в Аліканте, доставка по Коста-Бланці та обслуговування 4 мовами.",
    },
};

const CONTACTS = {
    h1: NAV_LABELS.contacts,
    intro: {
        es: `Exposición en ${SITE_SEED.address.es}, ${SITE_SEED.workingHours.es}. Teléfono y WhatsApp: ${SITE_SEED.phone}. Escríbenos y te respondemos en tu idioma.`,
        en: `Showroom in ${SITE_SEED.address.en}, ${SITE_SEED.workingHours.en}. Phone and WhatsApp: ${SITE_SEED.phone}. Write to us and we will reply in your language.`,
        ru: `Шоурум: ${SITE_SEED.address.ru}, ${SITE_SEED.workingHours.ru}. Телефон и WhatsApp: ${SITE_SEED.phone}. Напишите нам, и мы ответим на вашем языке.`,
        uk: `Шоурум: ${SITE_SEED.address.uk}, ${SITE_SEED.workingHours.uk}. Телефон і WhatsApp: ${SITE_SEED.phone}. Напишіть нам, і ми відповімо вашою мовою.`,
    },
    formIntro: {
        es: "Cuéntanos qué sofá te interesa y un asesor te contactará en horario de tienda.",
        en: "Tell us which sofa you are interested in and an advisor will contact you during opening hours.",
        ru: "Расскажите, какой диван вас интересует, и менеджер свяжется с вами в рабочее время.",
        uk: "Розкажіть, який диван вас цікавить, і менеджер зв'яжеться з вами в робочий час.",
    },
    metaDescription: {
        es: `Contacta con ${BRAND_NAME}: exposición en Alicante, teléfono, WhatsApp y formulario para consultar precio y plazo de cualquier sofá.`,
        en: `Contact ${BRAND_NAME}: showroom in Alicante, phone, WhatsApp and a form to ask for the price and lead time of any sofa.`,
        ru: `Контакты ${BRAND_NAME}: шоурум в Аликанте, телефон, WhatsApp и форма, чтобы узнать цену и сроки на любой диван.`,
        uk: `Контакти ${BRAND_NAME}: шоурум в Аліканте, телефон, WhatsApp і форма, щоб дізнатися ціну та терміни на будь-який диван.`,
    },
};

export const homePageData = (locale: Locale, { contactsPageId }: PageRefs): PageLocaleData => ({
    title: HOME.title[locale],
    hero: {
        type: "lowImpact",
        richText: richText({ h: "h1", text: HOME.h1[locale] }, HOME.intro[locale]),
        links: [
            {
                link: {
                    type: "custom",
                    url: ROUTES.catalog(locale),
                    label: HOME.catalogCta[locale],
                    appearance: "default",
                },
            },
        ],
    },
    layout: [
        {
            blockType: "productArchive",
            introContent: richText({ h: "h2", text: HOME.featured[locale] }),
            populateBy: "collection",
            featuredOnly: true,
            limit: 8,
            showViewAll: true,
        },
        {
            blockType: "faq",
            title: HOME.faqTitle[locale],
            items: HOME.faq.map((item) => ({
                question: item.q[locale],
                answer: richText(item.a[locale]),
            })),
        },
        {
            blockType: "cta",
            richText: richText(HOME.ctaText[locale]),
            links: contactsPageId
                ? [
                      {
                          link: {
                              type: "reference",
                              reference: { relationTo: "pages", value: contactsPageId },
                              label: HOME.ctaButton[locale],
                              appearance: "default",
                          },
                      },
                  ]
                : [],
        },
    ],
    meta: { title: HOME.metaTitle[locale], description: HOME.metaDescription[locale] },
});

export const aboutPageData = (locale: Locale): PageLocaleData => ({
    title: ABOUT.h1[locale],
    hero: {
        type: "lowImpact",
        richText: richText({ h: "h1", text: ABOUT.h1[locale] }, ABOUT.intro[locale]),
    },
    layout: [
        {
            blockType: "content",
            columns: [
                { size: "half", richText: richText(...ABOUT.col1[locale]), enableLink: false },
                { size: "half", richText: richText(...ABOUT.col2[locale]), enableLink: false },
            ],
        },
    ],
    meta: { title: ABOUT.h1[locale], description: ABOUT.metaDescription[locale] },
});

export const contactsPageData = (locale: Locale, { formId }: PageRefs): PageLocaleData => ({
    title: CONTACTS.h1[locale],
    hero: {
        type: "lowImpact",
        richText: richText({ h: "h1", text: CONTACTS.h1[locale] }, CONTACTS.intro[locale]),
    },
    layout: formId
        ? [
              {
                  blockType: "formBlock",
                  form: formId,
                  enableIntro: true,
                  introContent: richText(CONTACTS.formIntro[locale]),
              },
          ]
        : [],
    meta: { title: CONTACTS.h1[locale], description: CONTACTS.metaDescription[locale] },
});
