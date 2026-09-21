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
        <div className="grid grid-cols-4 gap-x-12 gap-y-10 lg:grid-cols-12">
            {columns?.map((column, index) => {
                const { enableLink, link, richText, size } = column;
                return (
                    <div
                        key={index}
                        className={cn(
                            "col-span-4 flex flex-col gap-5",
                            COLUMN_SPAN[size ?? "oneThird"],
                            {
                                "md:col-span-2": size !== "full",
                            }
                        )}
                    >
                        {richText && (
                            <RichText
                                data={richText}
                                enableGutter={false}
                                className={cn(size === "full" && "max-w-[65ch]")}
                            />
                        )}
                        {enableLink && link && (
                            <div>
                                <CmsLink {...link} className="rounded-full" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </Container>
);
