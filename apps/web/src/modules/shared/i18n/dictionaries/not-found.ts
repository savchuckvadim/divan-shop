import type { Locale } from "@/modules/shared/config";

export interface NotFoundDictionary {
    title: string;
    text: string;
    goHome: string;
}

export const NOT_FOUND: Record<Locale, NotFoundDictionary> = {
    ru: {
        title: "Страница не найдена",
        text: "Такой страницы нет или она была удалена.",
        goHome: "На главную",
    },
    en: {
        title: "Page not found",
        text: "This page does not exist or has been removed.",
        goHome: "Go home",
    },
    es: {
        title: "Página no encontrada",
        text: "Esta página no existe o ha sido eliminada.",
        goHome: "Ir al inicio",
    },
    uk: {
        title: "Сторінку не знайдено",
        text: "Такої сторінки немає або її було видалено.",
        goHome: "На головну",
    },
};
