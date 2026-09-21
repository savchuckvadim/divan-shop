import { isPopulated } from "@/modules/shared/lib";
import type { Media } from "@/payload-types";

import type { Article } from "../type/article.type";

export const getArticleCover = (article: Article): Media | null =>
    isPopulated(article.cover) ? article.cover : null;

export const getArticleAuthorName = (article: Article): string | null =>
    isPopulated(article.author) ? article.author.name || null : null;
