import * as React from "react";

import { Heading } from "@workspace/ui/components/heading";
import { Text } from "@workspace/ui/components/text";
import { cn } from "@workspace/ui/lib/utils";

export interface EmptyStateProps extends Omit<React.ComponentProps<"div">, "title"> {
    title: React.ReactNode;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    as?: "h1" | "h2" | "h3" | "p";
}

function EmptyState({
    title,
    description,
    icon,
    action,
    as = "h2",
    className,
    ...props
}: EmptyStateProps) {
    return (
        <div
            data-slot="empty-state"
            className={cn(
                "flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center",
                className
            )}
            {...props}
        >
            {icon && (
                <div
                    data-slot="empty-state-icon"
                    className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary [&_svg]:size-6"
                >
                    {icon}
                </div>
            )}
            <div className="flex max-w-[36rem] flex-col gap-2">
                {as === "p" ? (
                    <Text className="font-serif text-lg font-medium text-foreground">{title}</Text>
                ) : (
                    <Heading as={as} size={as === "h1" ? "lg" : "sm"}>
                        {title}
                    </Heading>
                )}
                {description && <Text muted>{description}</Text>}
            </div>
            {action && (
                <div data-slot="empty-state-action" className="flex items-center gap-2">
                    {action}
                </div>
            )}
        </div>
    );
}

export { EmptyState };
