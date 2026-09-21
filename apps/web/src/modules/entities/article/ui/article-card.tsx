import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { Text } from "@workspace/ui/components/text";
import { Card } from "@workspace/ui/composites/card";
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
        <Card
            interactive
            padding="sm"
            className={cn("h-full", className)}
            media={
                <Link
                    href={href}
                    className="relative block aspect-[16/10]"
                    aria-label={article.title}
                    tabIndex={-1}
                >
                    {cover ? (
                        <Media
                            resource={cover}
                            fill
                            priority={priority}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            imgClassName="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
                        />
                    ) : (
                        <span
                            aria-hidden
                            className="flex h-full items-center justify-center bg-hero font-serif text-6xl italic text-primary/40"
                        >
                            {article.title.charAt(0)}
                        </span>
                    )}
                </Link>
            }
            eyebrow={
                article.publishedAt && (
                    <time dateTime={article.publishedAt}>
                        {formatDate(article.publishedAt, locale)}
                    </time>
                )
            }
            title={
                <Link href={href} className="transition-colors hover:text-primary">
                    {article.title}
                </Link>
            }
            footer={
                <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                    {blog.readMore}
                    <ArrowRightIcon
                        className="size-4 transition-transform duration-300 ease-soft group-hover:translate-x-0.5"
                        aria-hidden
                    />
                </Link>
            }
        >
            {article.excerpt && (
                <Text size="sm" muted className="line-clamp-3">
                    {article.excerpt}
                </Text>
            )}
        </Card>
    );
};
