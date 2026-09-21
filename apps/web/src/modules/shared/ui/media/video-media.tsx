"use client";

import { cn } from "@workspace/ui/lib/utils";

import { getMediaUrl, isPopulated } from "@/modules/shared/lib";

import type { MediaProps } from "./types";

export const VideoMedia = ({ resource, videoClassName }: MediaProps) => {
    if (!isPopulated(resource)) return null;

    return (
        <video autoPlay className={cn(videoClassName)} controls={false} loop muted playsInline>
            <source src={getMediaUrl(resource.url)} />
        </video>
    );
};
