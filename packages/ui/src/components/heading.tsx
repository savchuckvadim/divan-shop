import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const headingVariants = cva(
    "font-display font-medium tracking-[-0.02em] text-balance [&_em]:font-normal [&_em]:italic [&_em]:text-brand",
    {
        variants: {
            size: {
                xl: "text-[clamp(2.5rem,1.35rem+3.6vw,7.5rem)] leading-[1.02]",
                lg: "text-[clamp(2rem,1.25rem+2.3vw,5rem)] leading-[1.06]",
                md: "text-[clamp(1.625rem,1.2rem+1.3vw,3.25rem)] leading-[1.12]",
                sm: "text-[clamp(1.25rem,1.1rem+0.5vw,1.875rem)] leading-snug",
                xs: "text-lg leading-snug",
            },
        },
        defaultVariants: {
            size: "lg",
        },
    }
);

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
