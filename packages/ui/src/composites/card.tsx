import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    Card as CardRoot,
    CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

const cardVariants = cva("flex flex-col overflow-hidden p-0", {
    variants: {
        padding: {
            none: "[--card-padding:0px]",
            sm: "[--card-padding:1rem]",
            md: "[--card-padding:1.5rem]",
        },
        interactive: {
            true: "group transition-shadow hover:shadow-md focus-within:shadow-md",
            false: "",
        },
    },
    defaultVariants: {
        padding: "md",
        interactive: false,
    },
});

export interface CardProps
    extends Omit<React.ComponentProps<"div">, "title">, VariantProps<typeof cardVariants> {
    title?: React.ReactNode;
    description?: React.ReactNode;
    eyebrow?: React.ReactNode;
    media?: React.ReactNode;
    footer?: React.ReactNode;
    actions?: React.ReactNode;
}

function Card({
    title,
    description,
    eyebrow,
    media,
    footer,
    actions,
    padding,
    interactive,
    className,
    children,
    ...props
}: CardProps) {
    const hasHeader = Boolean(title || description || eyebrow || actions);

    return (
        <CardRoot
            data-slot="card-composite"
            data-padding={padding ?? "md"}
            data-interactive={interactive ? "true" : undefined}
            className={cn(cardVariants({ padding, interactive }), className)}
            {...props}
        >
            {media && (
                <div data-slot="card-media" className="relative overflow-hidden bg-muted">
                    {media}
                </div>
            )}
            {hasHeader && (
                <CardHeader className="flex-row items-start justify-between gap-3 p-[var(--card-padding)] pb-0">
                    <div className="flex min-w-0 flex-col gap-1.5">
                        {eyebrow && (
                            <div
                                data-slot="card-eyebrow"
                                className="text-xs uppercase tracking-wide text-muted-foreground"
                            >
                                {eyebrow}
                            </div>
                        )}
                        {title && (
                            <CardTitle className="font-serif text-lg font-medium leading-snug tracking-normal">
                                {title}
                            </CardTitle>
                        )}
                        {description && <CardDescription>{description}</CardDescription>}
                    </div>
                    {actions && (
                        <div data-slot="card-actions" className="flex shrink-0 items-center gap-2">
                            {actions}
                        </div>
                    )}
                </CardHeader>
            )}
            {children && (
                <CardContent
                    className={cn(
                        "flex flex-1 flex-col gap-2 p-[var(--card-padding)]",
                        hasHeader && "pt-2"
                    )}
                >
                    {children}
                </CardContent>
            )}
            {footer && (
                <CardFooter
                    className={cn(
                        "mt-auto justify-between gap-2 p-[var(--card-padding)]",
                        (hasHeader || children) && "pt-2"
                    )}
                >
                    {footer}
                </CardFooter>
            )}
        </CardRoot>
    );
}

const cardGridVariants = cva("grid grid-cols-1", {
    variants: {
        cols: {
            2: "sm:grid-cols-2",
            3: "sm:grid-cols-2 lg:grid-cols-3",
            4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        },
        gap: {
            sm: "gap-3",
            md: "gap-6",
            lg: "gap-8",
        },
    },
    defaultVariants: {
        cols: 3,
        gap: "md",
    },
});

type CardGridTag = "div" | "ul" | "ol";

export interface CardGridProps
    extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof cardGridVariants> {
    as?: CardGridTag;
}

function CardGrid({ as = "div", cols, gap, className, ...props }: CardGridProps) {
    const Comp = as;

    return (
        <Comp
            data-slot="card-grid"
            data-cols={cols ?? 3}
            className={cn(cardGridVariants({ cols, gap }), className)}
            {...props}
        />
    );
}

export { Card, CardGrid, cardGridVariants, cardVariants };
