import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const badgeVariants = cva(
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 ring-ring/15 outline-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80",
                outline:
                    "border-border/80 bg-background/70 text-muted-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
                success: "border-transparent bg-success text-foreground [a&]:hover:bg-success/80",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
    asChild?: boolean;
}

function Badge({ asChild = false, className, variant, ...props }: BadgeProps) {
    const Comp = asChild ? Slot : "span";

    return (
        <Comp
            data-slot="badge"
            data-variant={variant ?? "default"}
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
