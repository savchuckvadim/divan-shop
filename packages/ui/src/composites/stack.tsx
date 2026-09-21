import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const gapVariants = {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
} as const;

const stackVariants = cva("flex", {
    variants: {
        direction: {
            row: "flex-row",
            column: "flex-col",
        },
        gap: gapVariants,
        align: {
            start: "items-start",
            center: "items-center",
            end: "items-end",
            stretch: "items-stretch",
            baseline: "items-baseline",
        },
        justify: {
            start: "justify-start",
            center: "justify-center",
            end: "justify-end",
            between: "justify-between",
            around: "justify-around",
        },
        wrap: {
            true: "flex-wrap",
            false: "flex-nowrap",
        },
    },
    defaultVariants: {
        direction: "column",
        gap: "md",
        align: "stretch",
        justify: "start",
        wrap: false,
    },
});

type StackTag = "div" | "ul" | "ol" | "nav" | "span";

export interface StackProps
    extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof stackVariants> {
    as?: StackTag;
}

function Stack({
    as = "div",
    direction,
    gap,
    align,
    justify,
    wrap,
    className,
    ...props
}: StackProps) {
    const Comp = as;

    return (
        <Comp
            data-slot="stack"
            data-direction={direction ?? "column"}
            className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)}
            {...props}
        />
    );
}

const gridVariants = cva("grid grid-cols-1", {
    variants: {
        cols: {
            1: "",
            2: "md:grid-cols-2",
            3: "md:grid-cols-2 lg:grid-cols-3",
            4: "sm:grid-cols-2 lg:grid-cols-4",
        },
        gap: gapVariants,
    },
    defaultVariants: {
        cols: 1,
        gap: "md",
    },
});

type GridTag = "div" | "ul" | "ol";

export interface GridProps
    extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof gridVariants> {
    as?: GridTag;
}

function Grid({ as = "div", cols, gap, className, ...props }: GridProps) {
    const Comp = as;

    return (
        <Comp
            data-slot="grid"
            data-cols={cols ?? 1}
            className={cn(gridVariants({ cols, gap }), className)}
            {...props}
        />
    );
}

export { Grid, gridVariants, Stack, stackVariants };
