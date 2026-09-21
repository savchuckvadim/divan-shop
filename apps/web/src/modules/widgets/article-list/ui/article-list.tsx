import { cn } from "@workspace/ui/lib/utils";

import { type Article, ArticleCard } from "@/modules/entities";
import type { Locale } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";

interface ArticleListProps {
    articles: Article[];
    locale: Locale;
    className?: string;
    emptyText?: string;
}

export const ArticleList = ({ articles, locale, className, emptyText }: ArticleListProps) => {
    if (!articles.length) {
        return (
            <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
                {emptyText ?? getDictionary(locale).blog.empty}
            </p>
        );
    }

    return (
        <ul className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
            {articles.map((article, index) => (
                <li key={article.id}>
                    <ArticleCard article={article} locale={locale} priority={index < 3} />
                </li>
            ))}
        </ul>
    );
};
