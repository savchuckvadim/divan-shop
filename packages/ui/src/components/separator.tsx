import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

export interface SeparatorProps extends React.ComponentProps<"div"> {
    orientation?: "horizontal" | "vertical";
    decorative?: boolean;
}

function Separator({
    className,
    orientation = "horizontal",
    decorative = true,
    ...props
}: SeparatorProps) {
    return (
        <div
            data-slot="separator"
            data-orientation={orientation}
            role={decorative ? "none" : "separator"}
            aria-orientation={decorative ? undefined : orientation}
            className={cn(
                "bg-border shrink-0",
                orientation === "horizontal" ? "h-px w-full" : "h-full w-px self-stretch",
                className
            )}
            {...props}
        />
    );
}

export { Separator };
