interface LexicalNode {
    type?: string;
    text?: string;
    children?: LexicalNode[];
    [key: string]: unknown;
}

interface LexicalRoot {
    root?: LexicalNode;
}

const BLOCK_TYPES = new Set(["paragraph", "heading", "listitem", "quote"]);

const walk = (node: LexicalNode, parts: string[]): void => {
    if (node.type === "linebreak") {
        parts.push("\n");
        return;
    }
    if (typeof node.text === "string") {
        parts.push(node.text);
    }
    for (const child of node.children ?? []) {
        walk(child, parts);
    }
    if (node.type && BLOCK_TYPES.has(node.type)) {
        parts.push("\n");
    }
};

/** Flattens a Lexical editor state to plain text; used for JSON-LD and meta fallbacks. */
export const lexicalToPlainText = (data: LexicalRoot | null | undefined): string => {
    if (!data?.root) return "";
    const parts: string[] = [];
    walk(data.root, parts);
    return parts
        .join("")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{2,}/g, "\n")
        .trim();
};
