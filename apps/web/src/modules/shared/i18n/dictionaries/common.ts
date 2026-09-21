import type { Locale } from "@/modules/shared/config";

export interface CommonDictionary {
    siteName: string;
    tagline: string;
    callUs: string;
    requestQuote: string;
    viewAll: string;
    readMore: string;
    loading: string;
    error: string;
    home: string;
    catalog: string;
    blog: string;
    contacts: string;
    allRightsReserved: string;
    skipToContent: string;
    language: string;
}

export const COMMON: Record<Locale, CommonDictionary> = {
    ru: {
        siteName: "Divan Shop",
        tagline: "Диваны, в которых хочется жить",
        callUs: "Позвонить",
        requestQuote: "Оставить заявку",
        viewAll: "Смотреть все",
        readMore: "Подробнее",
        loading: "Загрузка…",
        error: "Что-то пошло не так",
        home: "Главная",
        catalog: "Каталог",
        blog: "Блог",
        contacts: "Контакты",
        allRightsReserved: "Все права защищены",
        skipToContent: "Перейти к содержимому",
        language: "Язык",
    },
    en: {
        siteName: "Divan Shop",
        tagline: "Sofas you want to live in",
        callUs: "Call us",
        requestQuote: "Request a quote",
        viewAll: "View all",
        readMore: "Read more",
        loading: "Loading…",
        error: "Something went wrong",
        home: "Home",
        catalog: "Catalog",
        blog: "Blog",
        contacts: "Contacts",
        allRightsReserved: "All rights reserved",
        skipToContent: "Skip to content",
        language: "Language",
    },
    es: {
        siteName: "Divan Shop",
        tagline: "Sofás en los que apetece vivir",
        callUs: "Llámanos",
        requestQuote: "Solicitar presupuesto",
        viewAll: "Ver todo",
        readMore: "Leer más",
        loading: "Cargando…",
        error: "Algo salió mal",
        home: "Inicio",
        catalog: "Catálogo",
        blog: "Blog",
        contacts: "Contacto",
        allRightsReserved: "Todos los derechos reservados",
        skipToContent: "Ir al contenido",
        language: "Idioma",
    },
    uk: {
        siteName: "Divan Shop",
        tagline: "Дивани, в яких хочеться жити",
        callUs: "Зателефонувати",
        requestQuote: "Залишити заявку",
        viewAll: "Дивитися всі",
        readMore: "Детальніше",
        loading: "Завантаження…",
        error: "Щось пішло не так",
        home: "Головна",
        catalog: "Каталог",
        blog: "Блог",
        contacts: "Контакти",
        allRightsReserved: "Всі права захищені",
        skipToContent: "Перейти до вмісту",
        language: "Мова",
    },
};
