import type { Locale } from "@/modules/shared/config";

export interface CommonDictionary {
    siteName: string;
    tagline: string;
    cityLine: string;
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
    navigation: string;
    menu: string;
    closeMenu: string;
    previousPage: string;
    nextPage: string;
    pageOf: string;
    noImage: string;
    allRightsReserved: string;
    skipToContent: string;
    language: string;
}

export const COMMON: Record<Locale, CommonDictionary> = {
    ru: {
        siteName: "Divan Shop",
        tagline: "Диваны, в которых хочется жить",
        cityLine: "Аликанте · Коста-Бланка",
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
        navigation: "Навигация",
        menu: "Открыть меню",
        closeMenu: "Закрыть меню",
        previousPage: "Предыдущая страница",
        nextPage: "Следующая страница",
        pageOf: "Страница {page} из {total}",
        noImage: "Фото скоро появится",
        allRightsReserved: "Все права защищены",
        skipToContent: "Перейти к содержимому",
        language: "Язык",
    },
    en: {
        siteName: "Divan Shop",
        tagline: "Sofas you want to live in",
        cityLine: "Alicante · Costa Blanca",
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
        navigation: "Navigation",
        menu: "Open menu",
        closeMenu: "Close menu",
        previousPage: "Previous page",
        nextPage: "Next page",
        pageOf: "Page {page} of {total}",
        noImage: "Photo coming soon",
        allRightsReserved: "All rights reserved",
        skipToContent: "Skip to content",
        language: "Language",
    },
    es: {
        siteName: "Divan Shop",
        tagline: "Sofás en los que apetece vivir",
        cityLine: "Alicante · Costa Blanca",
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
        navigation: "Navegación",
        menu: "Abrir menú",
        closeMenu: "Cerrar menú",
        previousPage: "Página anterior",
        nextPage: "Página siguiente",
        pageOf: "Página {page} de {total}",
        noImage: "Foto próximamente",
        allRightsReserved: "Todos los derechos reservados",
        skipToContent: "Ir al contenido",
        language: "Idioma",
    },
    uk: {
        siteName: "Divan Shop",
        tagline: "Дивани, в яких хочеться жити",
        cityLine: "Аліканте · Коста-Бланка",
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
        navigation: "Навігація",
        menu: "Відкрити меню",
        closeMenu: "Закрити меню",
        previousPage: "Попередня сторінка",
        nextPage: "Наступна сторінка",
        pageOf: "Сторінка {page} з {total}",
        noImage: "Фото скоро з'явиться",
        allRightsReserved: "Всі права захищені",
        skipToContent: "Перейти до вмісту",
        language: "Мова",
    },
};
