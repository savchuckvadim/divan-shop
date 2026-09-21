import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

export interface KeyValueItem {
    label: React.ReactNode;
    value: React.ReactNode;
    key?: string;
}

export interface KeyValueListProps extends React.ComponentProps<"dl"> {
    items: KeyValueItem[];
    bordered?: boolean;
}

function KeyValueList({ items, bordered = true, className, ...props }: KeyValueListProps) {
    if (!items.length) return null;

    return (
        <dl
            data-slot="key-value-list"
            data-bordered={bordered ? "true" : undefined}
            className={cn(
                "divide-y divide-border/70",
                bordered && "rounded-xl border border-border",
                className
            )}
            {...props}
        >
            {items.map((item, index) => (
                <div
                    key={item.key ?? index}
                    data-slot="key-value-item"
                    className={cn(
                        "flex items-baseline gap-3 py-3 text-sm",
                        bordered ? "px-4" : "px-0"
                    )}
                >
                    <dt className="shrink-0 text-muted-foreground">{item.label}</dt>
                    <dd className="flex flex-1 items-baseline justify-end gap-3 text-right font-medium tabular-nums before:h-px before:flex-1 before:border-b before:border-dotted before:border-border before:content-['']">
                        {item.value}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

export { KeyValueList };
