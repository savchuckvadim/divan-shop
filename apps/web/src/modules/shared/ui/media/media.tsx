import { Fragment } from "react";

import { isPopulated } from "@/modules/shared/lib";

import { ImageMedia } from "./image-media";
import type { MediaProps } from "./types";
import { VideoMedia } from "./video-media";

export const Media = (props: MediaProps) => {
    const { className, htmlElement = "div", resource } = props;

    const isVideo = isPopulated(resource) && resource.mimeType?.includes("video");
    const Tag = htmlElement || Fragment;

    return (
        <Tag {...(htmlElement !== null ? { className } : {})}>
            {isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />}
        </Tag>
    );
};
