"use client";

import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/15 dark:ring-ring/25 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
                outline:
                    "border border-input bg-background shadow-xs hover:border-foreground/30 hover:bg-secondary/60",
                secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                clear: "",
                default: "h-10 px-4 py-2 has-[>svg]:px-3",
                sm: "h-9 rounded-md px-3 has-[>svg]:px-2.5",
                lg: "h-12 rounded-md px-7 text-base has-[>svg]:px-5",
                icon: "size-10",
            },
            shape: {
                default: "",
                pill: "rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            shape: "default",
        },
    }
);

export interface ButtonProps
    extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

function Button({ asChild = false, className, size, variant, shape, ...props }: ButtonProps) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            data-variant={variant ?? "default"}
            data-size={size ?? "default"}
            data-shape={shape ?? "default"}
            className={cn(buttonVariants({ variant, size, shape, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
