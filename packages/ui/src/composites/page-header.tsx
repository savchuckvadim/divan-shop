import * as React from "react";

import { Heading } from "@workspace/ui/components/heading";
import { Text } from "@workspace/ui/components/text";
import { cn } from "@workspace/ui/lib/utils";

export interface PageHeaderProps extends Omit<React.ComponentProps<"div">, "title"> {
    title: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    eyebrow?: React.ReactNode;
}

function PageHeader({
    title,
    description,
    actions,
    eyebrow,
    className,
    children,
    ...props
}: PageHeaderProps) {
    return (
        <div
            data-slot="page-header"
            className={cn(
                "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
                className
            )}
            {...props}
        >
            <div className="flex min-w-0 flex-col gap-3">
                {eyebrow && (
                    <Text
                        as="span"
                        size="sm"
                        muted
                        data-slot="page-header-eyebrow"
                        className="uppercase tracking-wide"
                    >
                        {eyebrow}
                    </Text>
                )}
                <Heading as="h1" size="xl" className="max-w-[40rem]">
                    {title}
                </Heading>
                {description && (
                    <Text size="lg" muted className="max-w-[36rem]">
                        {description}
                    </Text>
                )}
                {children}
            </div>
            {actions && (
                <div data-slot="page-header-actions" className="flex shrink-0 items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}

export { PageHeader };
