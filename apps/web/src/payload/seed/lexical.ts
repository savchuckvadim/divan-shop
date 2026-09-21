import type { Page } from "@/payload-types";

export type RichTextState = NonNullable<Page["hero"]["richText"]>;

type HeadingTag = "h1" | "h2" | "h3" | "h4";

export type RichTextInput = string | { h: HeadingTag; text: string };

const textNode = (text: string) => ({
    type: "text",
    text,
    version: 1,
    detail: 0,
    format: 0,
    mode: "normal",
    style: "",
});

const paragraphNode = (text: string) => ({
    type: "paragraph",
    children: [textNode(text)],
    direction: "ltr",
    format: "",
    indent: 0,
    version: 1,
    textFormat: 0,
    textStyle: "",
});

const headingNode = (tag: HeadingTag, text: string) => ({
    type: "heading",
    tag,
    children: [textNode(text)],
    direction: "ltr",
    format: "",
    indent: 0,
    version: 1,
});

/** Builds a Lexical editor state from plain paragraphs and headings. */
export const richText = (...blocks: RichTextInput[]): RichTextState => ({
    root: {
        type: "root",
        children: blocks.map((block) =>
            typeof block === "string" ? paragraphNode(block) : headingNode(block.h, block.text)
        ),
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
    },
});
