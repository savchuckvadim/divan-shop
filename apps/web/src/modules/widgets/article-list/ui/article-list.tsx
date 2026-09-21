import { CardGrid } from "@workspace/ui/composites/card";
import { EmptyState } from "@workspace/ui/composites/empty-state";

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
            <EmptyState
                as="p"
                className={className}
                title={emptyText ?? getDictionary(locale).blog.empty}
            />
        );
    }

    return (
        <CardGrid as="ul" cols={3} className={className}>
            {articles.map((article, index) => (
                <li key={article.id}>
                    <ArticleCard article={article} locale={locale} priority={index < 3} />
                </li>
            ))}
        </CardGrid>
    );
};
