import type { Locale } from "@/modules/shared/config";

export interface BlogDictionary {
    title: string;
    description: string;
    readMore: string;
    publishedOn: string;
    allArticles: string;
    empty: string;
    related: string;
    previousPage: string;
    nextPage: string;
}

export const BLOG: Record<Locale, BlogDictionary> = {
    ru: {
        title: "Блог",
        description: "Как выбрать диван, механизмы, ткани и уход — советы из шоурума в Аликанте.",
        readMore: "Читать",
        publishedOn: "Опубликовано {date}",
        allArticles: "Все статьи",
        empty: "Статей пока нет",
        related: "Читайте также",
        previousPage: "Предыдущая страница",
        nextPage: "Следующая страница",
    },
    en: {
        title: "Blog",
        description:
            "How to choose a sofa, mechanisms, fabrics and care — advice from our Alicante showroom.",
        readMore: "Read more",
        publishedOn: "Published {date}",
        allArticles: "All articles",
        empty: "No articles yet",
        related: "Read also",
        previousPage: "Previous page",
        nextPage: "Next page",
    },
    es: {
        title: "Blog",
        description:
            "Cómo elegir sofá, mecanismos, telas y cuidados — consejos desde nuestra exposición en Alicante.",
        readMore: "Leer más",
        publishedOn: "Publicado el {date}",
        allArticles: "Todos los artículos",
        empty: "Todavía no hay artículos",
        related: "Lee también",
        previousPage: "Página anterior",
        nextPage: "Página siguiente",
    },
    uk: {
        title: "Блог",
        description: "Як обрати диван, механізми, тканини та догляд — поради з шоуруму в Аліканте.",
        readMore: "Читати",
        publishedOn: "Опубліковано {date}",
        allArticles: "Усі статті",
        empty: "Статей поки немає",
        related: "Читайте також",
        previousPage: "Попередня сторінка",
        nextPage: "Наступна сторінка",
    },
};
