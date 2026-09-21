"use client";

import type { HTMLAttributes } from "react";

import {
    type DefaultNodeTypes,
    type DefaultTypedEditorState,
    type SerializedLinkNode,
} from "@payloadcms/richtext-lexical";
import {
    RichText as ConvertRichText,
    type JSXConvertersFunction,
    LinkJSXConverter,
} from "@payloadcms/richtext-lexical/react";

import { cn } from "@workspace/ui/lib/utils";

import { useI18n } from "@/modules/shared/i18n";
import { type CmsLinkCollection, hrefForDoc } from "@/modules/shared/lib";

export interface RichTextProps extends HTMLAttributes<HTMLDivElement> {
    data: DefaultTypedEditorState;
    enableGutter?: boolean;
    enableProse?: boolean;
}

export const RichText = ({
    className,
    enableProse = true,
    enableGutter = true,
    ...rest
}: RichTextProps) => {
    const { locale } = useI18n();

    const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
        const doc = linkNode.fields.doc;
        if (!doc || typeof doc.value !== "object" || !("slug" in doc.value) || !doc.value.slug) {
            return "#";
        }
        return hrefForDoc(doc.relationTo as CmsLinkCollection, String(doc.value.slug), locale);
    };

    const converters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
        ...defaultConverters,
        ...LinkJSXConverter({ internalDocToHref }),
    });

    return (
        <ConvertRichText
            converters={converters}
            className={cn(
                "payload-richtext",
                {
                    container: enableGutter,
                    "max-w-none": !enableGutter,
                    "prose md:prose-md dark:prose-invert mx-auto": enableProse,
                },
                className
            )}
            {...rest}
        />
    );
};
