import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const textVariants = cva("font-sans text-pretty", {
    variants: {
        size: {
            xs: "text-xs leading-relaxed",
            sm: "text-sm leading-relaxed",
            md: "text-base leading-relaxed",
            lg: "text-lg leading-relaxed md:text-xl",
        },
        muted: {
            true: "text-muted-foreground",
            false: "text-foreground",
        },
        eyebrow: {
            true: "text-[0.7rem] font-medium uppercase leading-none tracking-[0.18em]",
            false: "",
        },
        measure: {
            true: "max-w-[65ch]",
            false: "",
        },
    },
    defaultVariants: {
        size: "md",
        muted: false,
        eyebrow: false,
        measure: false,
    },
});

type TextTag = "p" | "span" | "div";

export interface TextProps extends React.ComponentProps<"p">, VariantProps<typeof textVariants> {
    as?: TextTag;
}

function Text({ as = "p", className, muted, size, eyebrow, measure, ...props }: TextProps) {
    const Comp = as;

    return (
        <Comp
            data-slot="text"
            data-size={size ?? "md"}
            data-eyebrow={eyebrow ? "true" : undefined}
            className={cn(textVariants({ size, muted, eyebrow, measure }), className)}
            {...props}
        />
    );
}

export { Text, textVariants };
