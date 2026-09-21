import * as React from "react";

import { Text } from "@workspace/ui/components/text";
import { cn } from "@workspace/ui/lib/utils";

export interface StatProps extends React.ComponentProps<"div"> {
    label: React.ReactNode;
    value: React.ReactNode;
    hint?: React.ReactNode;
}

function Stat({ label, value, hint, className, ...props }: StatProps) {
    return (
        <div data-slot="stat" className={cn("flex flex-col gap-1", className)} {...props}>
            <Text as="span" size="sm" muted data-slot="stat-label">
                {label}
            </Text>
            <span
                data-slot="stat-value"
                className="font-serif text-3xl font-semibold leading-none tracking-tight tabular-nums"
            >
                {value}
            </span>
            {hint && (
                <Text as="span" size="sm" muted data-slot="stat-hint">
                    {hint}
                </Text>
            )}
        </div>
    );
}

export { Stat };
