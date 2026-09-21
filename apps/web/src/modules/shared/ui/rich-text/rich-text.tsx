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
                    "prose md:prose-md dark:prose-invert mx-auto prose-headings:font-serif prose-headings:font-medium prose-headings:tracking-[-0.02em] prose-headings:text-balance prose-a:text-primary prose-a:underline-offset-4 prose-img:rounded-2xl prose-blockquote:border-primary/40 prose-blockquote:font-serif prose-blockquote:text-lg prose-blockquote:not-italic":
                        enableProse,
                },
                className
            )}
            {...rest}
        />
    );
};
