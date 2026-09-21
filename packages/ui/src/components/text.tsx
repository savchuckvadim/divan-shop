import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const textVariants = cva("font-sans", {
    variants: {
        size: {
            sm: "text-sm leading-relaxed",
            md: "text-base leading-relaxed",
            lg: "text-lg leading-relaxed md:text-xl",
        },
        muted: {
            true: "text-muted-foreground",
            false: "text-foreground",
        },
    },
    defaultVariants: {
        size: "md",
        muted: false,
    },
});

type TextTag = "p" | "span" | "div";

export interface TextProps extends React.ComponentProps<"p">, VariantProps<typeof textVariants> {
    as?: TextTag;
}

function Text({ as = "p", className, muted, size, ...props }: TextProps) {
    const Comp = as;

    return (
        <Comp
            data-slot="text"
            data-size={size ?? "md"}
            className={cn(textVariants({ size, muted }), className)}
            {...props}
        />
    );
}

export { Text, textVariants };
