import * as React from "react";

import { Container } from "@workspace/ui/components/container";
import { Heading } from "@workspace/ui/components/heading";
import {
    Section as SectionRoot,
    type SectionProps as SectionRootProps,
} from "@workspace/ui/components/section";
import { Text } from "@workspace/ui/components/text";
import { cn } from "@workspace/ui/lib/utils";

type SectionHeadingTag = "h1" | "h2" | "h3";

export interface SectionProps extends Omit<SectionRootProps, "title"> {
    title?: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    as?: SectionHeadingTag;
    contained?: boolean;
    contentClassName?: string;
}

const headingSize: Record<SectionHeadingTag, "xl" | "md" | "sm"> = {
    h1: "xl",
    h2: "md",
    h3: "sm",
};

function Section({
    title,
    description,
    actions,
    as = "h2",
    contained = true,
    padding,
    className,
    contentClassName,
    children,
    ...props
}: SectionProps) {
    const hasHeader = Boolean(title || description || actions);
    const Wrapper = contained ? Container : React.Fragment;

    return (
        <SectionRoot
            data-slot="section-composite"
            data-contained={contained ? "true" : undefined}
            padding={padding}
            className={className}
            {...props}
        >
            <Wrapper>
                {hasHeader && (
                    <div
                        data-slot="section-header"
                        className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between"
                    >
                        <div className="flex min-w-0 flex-col gap-2">
                            {title && (
                                <Heading as={as} size={headingSize[as]}>
                                    {title}
                                </Heading>
                            )}
                            {description && (
                                <Text muted className="max-w-[48rem]">
                                    {description}
                                </Text>
                            )}
                        </div>
                        {actions && (
                            <div
                                data-slot="section-actions"
                                className="flex shrink-0 items-center gap-2"
                            >
                                {actions}
                            </div>
                        )}
                    </div>
                )}
                <div data-slot="section-content" className={cn(contentClassName)}>
                    {children}
                </div>
            </Wrapper>
        </SectionRoot>
    );
}

export { Section };
