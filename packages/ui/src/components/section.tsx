import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const sectionVariants = cva("w-full", {
    variants: {
        padding: {
            none: "py-0",
            sm: "py-10 md:py-12",
            md: "py-14 md:py-20",
            lg: "py-20 md:py-28",
        },
    },
    defaultVariants: {
        padding: "md",
    },
});

export interface SectionProps
    extends React.ComponentProps<"section">, VariantProps<typeof sectionVariants> {}

function Section({ className, padding, ...props }: SectionProps) {
    return (
        <section
            data-slot="section"
            data-padding={padding ?? "md"}
            className={cn(sectionVariants({ padding }), className)}
            {...props}
        />
    );
}

export { Section, sectionVariants };
