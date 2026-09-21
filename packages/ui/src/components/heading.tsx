import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const headingVariants = cva(
    "font-serif font-medium tracking-[-0.02em] text-balance [&_em]:font-normal [&_em]:italic [&_em]:text-primary",
    {
        variants: {
            size: {
                xl: "text-[2.5rem] leading-[1.02] md:text-[3.25rem] lg:text-[4rem]",
                lg: "text-[2rem] leading-[1.08] md:text-[2.5rem] lg:text-[3rem]",
                md: "text-[1.625rem] leading-[1.15] md:text-[2rem]",
                sm: "text-xl leading-snug md:text-2xl",
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
