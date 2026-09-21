import { Container } from "@workspace/ui/components/container";
import { cn } from "@workspace/ui/lib/utils";

import { CmsLink, RichText } from "@/modules/shared/ui";
import type { ContentBlock as ContentBlockProps } from "@/payload-types";

const COLUMN_SPAN = {
    full: "lg:col-span-12",
    half: "lg:col-span-6",
    oneThird: "lg:col-span-4",
    twoThirds: "lg:col-span-8",
} as const;

export const ContentBlock = ({ columns }: ContentBlockProps) => (
    <Container>
        <div className="grid grid-cols-4 gap-x-16 gap-y-8 lg:grid-cols-12">
            {columns?.map((column, index) => {
                const { enableLink, link, richText, size } = column;
                return (
                    <div
                        key={index}
                        className={cn("col-span-4", COLUMN_SPAN[size ?? "oneThird"], {
                            "md:col-span-2": size !== "full",
                        })}
                    >
                        {richText && <RichText data={richText} enableGutter={false} />}
                        {enableLink && link && <CmsLink {...link} />}
                    </div>
                );
            })}
        </div>
    </Container>
);
