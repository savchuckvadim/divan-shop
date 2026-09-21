import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const headingVariants = cva("font-serif font-semibold tracking-tight text-balance", {
    variants: {
        size: {
            xl: "text-4xl leading-[1.1] md:text-5xl lg:text-6xl",
            lg: "text-3xl leading-[1.15] md:text-4xl",
            md: "text-2xl leading-tight md:text-3xl",
            sm: "text-xl leading-snug md:text-2xl",
        },
    },
    defaultVariants: {
        size: "lg",
    },
});

type HeadingTag = "h1" | "h2" | "h3" | "h4";

export interface HeadingProps
    extends React.ComponentProps<"h1">, VariantProps<typeof headingVariants> {
    as?: HeadingTag;
}

function Heading({ as = "h2", className, size, ...props }: HeadingProps) {
    const Comp = as;

    return (
        <Comp
            data-slot="heading"
            data-size={size ?? "lg"}
            className={cn(headingVariants({ size }), className)}
            {...props}
        />
    );
}

export { Heading, headingVariants };
