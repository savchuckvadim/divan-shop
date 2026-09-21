import Link from "next/link";

import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

import { type Locale, ROUTES } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";
import { formatDate } from "@/modules/shared/lib";
import { Media } from "@/modules/shared/ui";

import { getArticleCover } from "../lib/article-helpers";
import type { Article } from "../type/article.type";

interface ArticleCardProps {
    article: Article;
    locale: Locale;
    className?: string;
    priority?: boolean;
}

export const ArticleCard = ({ article, locale, className, priority }: ArticleCardProps) => {
    const { blog } = getDictionary(locale);
    const cover = getArticleCover(article);
    const href = ROUTES.article(locale, article.slug ?? "");

    return (
        <Card className={cn("group flex h-full flex-col overflow-hidden p-0", className)}>
            {cover && (
                <Link href={href} className="block" aria-label={article.title} tabIndex={-1}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        <Media
                            resource={cover}
                            fill
                            priority={priority}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                    </div>
                </Link>
            )}
            <CardContent className="flex flex-1 flex-col gap-3 p-5">
                {article.publishedAt && (
                    <time
                        dateTime={article.publishedAt}
                        className="text-xs uppercase tracking-wide text-muted-foreground"
                    >
                        {formatDate(article.publishedAt, locale)}
                    </time>
                )}
                <h3 className="font-serif text-xl font-medium leading-snug">
                    <Link href={href} className="hover:underline">
                        {article.title}
                    </Link>
                </h3>
                {article.excerpt && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">{article.excerpt}</p>
                )}
                <Link
                    href={href}
                    className="mt-auto text-sm font-medium underline-offset-4 hover:underline"
                >
                    {blog.readMore} →
                </Link>
            </CardContent>
        </Card>
    );
};
