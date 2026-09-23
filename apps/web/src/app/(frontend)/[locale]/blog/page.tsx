import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogPage, generateBlogPageMetadata } from "@/modules/pages";
import { isLocale } from "@/modules/shared/config";

/**
 * Rendered on demand and cached: the Docker image is built without a database
 * (see docs/HISTORY.md). Payload hooks call revalidatePath on publish.
 */
export const dynamic = "force-dynamic";

interface BlogRouteProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ page?: string }>;
}

const parsePage = (value?: string): number => Math.max(1, Number.parseInt(value ?? "1", 10) || 1);

export default async function BlogRoute({ params, searchParams }: BlogRouteProps) {
    const [{ locale }, { page }] = await Promise.all([params, searchParams]);
    if (!isLocale(locale)) notFound();

    return <BlogPage locale={locale} page={parsePage(page)} />;
}

export const generateMetadata = async ({
    params,
    searchParams,
}: BlogRouteProps): Promise<Metadata> => {
    const [{ locale }, { page }] = await Promise.all([params, searchParams]);
    if (!isLocale(locale)) return {};

    return generateBlogPageMetadata({ locale, page: parsePage(page) });
};
