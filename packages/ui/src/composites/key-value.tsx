import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

export interface KeyValueItem {
    label: React.ReactNode;
    value: React.ReactNode;
    key?: string;
}

export interface KeyValueListProps extends React.ComponentProps<"dl"> {
    items: KeyValueItem[];
}

function KeyValueList({ items, className, ...props }: KeyValueListProps) {
    if (!items.length) return null;

    return (
        <dl
            data-slot="key-value-list"
            className={cn("divide-y divide-border rounded-xl border border-border", className)}
            {...props}
        >
            {items.map((item, index) => (
                <div
                    key={item.key ?? index}
                    data-slot="key-value-item"
                    className="flex justify-between gap-6 px-4 py-3 text-sm"
                >
                    <dt className="text-muted-foreground">{item.label}</dt>
                    <dd className="text-right font-medium">{item.value}</dd>
                </div>
            ))}
        </dl>
    );
}

export { KeyValueList };
