import type { Locale } from "@/modules/shared/config";

export interface CatalogDictionary {
    title: string;
    description: string;
    allCategories: string;
    empty: string;
    productsCount: string;
    categories: string;
    featured: string;
}

export const CATALOG: Record<Locale, CatalogDictionary> = {
    ru: {
        title: "Каталог диванов",
        description: "Прямые, угловые и модульные диваны с доставкой и гарантией.",
        allCategories: "Все категории",
        empty: "В этой категории пока нет товаров",
        productsCount: "{count} товаров",
        categories: "Категории",
        featured: "Популярные модели",
    },
    en: {
        title: "Sofa catalog",
        description: "Straight, corner and modular sofas with delivery and warranty.",
        allCategories: "All categories",
        empty: "There are no products in this category yet",
        productsCount: "{count} products",
        categories: "Categories",
        featured: "Popular models",
    },
    es: {
        title: "Catálogo de sofás",
        description: "Sofás rectos, de esquina y modulares con entrega y garantía.",
        allCategories: "Todas las categorías",
        empty: "Todavía no hay productos en esta categoría",
        productsCount: "{count} productos",
        categories: "Categorías",
        featured: "Modelos populares",
    },
    uk: {
        title: "Каталог диванів",
        description: "Прямі, кутові та модульні дивани з доставкою та гарантією.",
        allCategories: "Всі категорії",
        empty: "У цій категорії поки немає товарів",
        productsCount: "{count} товарів",
        categories: "Категорії",
        featured: "Популярні моделі",
    },
};
