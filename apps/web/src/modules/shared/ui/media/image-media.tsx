"use client";

import NextImage, { type StaticImageData } from "next/image";

import { cn } from "@workspace/ui/lib/utils";

import { getMediaUrl, isPopulated } from "@/modules/shared/lib";

import type { MediaProps } from "./types";

const DEFAULT_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

const PLACEHOLDER_BLUR =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjZWVlOGUwIi8+PC9zdmc+";

export const ImageMedia = ({
    alt: altFromProps,
    fill,
    pictureClassName,
    imgClassName,
    priority,
    resource,
    sizes = DEFAULT_SIZES,
    src: srcFromProps,
    loading: loadingFromProps,
}: MediaProps) => {
    let width: number | undefined;
    let height: number | undefined;
    let alt = altFromProps;
    let src: StaticImageData | string = srcFromProps || "";

    if (!src && isPopulated(resource)) {
        width = resource.width ?? undefined;
        height = resource.height ?? undefined;
        alt = alt ?? resource.alt ?? "";
        src = getMediaUrl(resource.url, resource.updatedAt);
    }

    if (!src) return null;

    const loading = loadingFromProps || (!priority ? "lazy" : undefined);

    return (
        <picture className={cn(pictureClassName)}>
            <NextImage
                alt={alt || ""}
                className={cn(imgClassName)}
                fill={fill}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                placeholder="blur"
                blurDataURL={PLACEHOLDER_BLUR}
                priority={priority}
                loading={loading}
                sizes={sizes}
                src={src}
            />
        </picture>
    );
};
