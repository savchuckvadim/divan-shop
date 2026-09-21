import type { ElementType } from "react";

import type { StaticImageData } from "next/image";

import type { Media as MediaType } from "@/payload-types";

export interface MediaProps {
    alt?: string;
    className?: string;
    fill?: boolean;
    htmlElement?: ElementType | null;
    pictureClassName?: string;
    imgClassName?: string;
    videoClassName?: string;
    loading?: "lazy" | "eager";
    priority?: boolean;
    resource?: MediaType | string | number | null;
    sizes?: string;
    src?: StaticImageData;
}
