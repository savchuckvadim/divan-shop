import { Container } from "@workspace/ui/components/container";
import { cn } from "@workspace/ui/lib/utils";

import { CmsLink, RichText } from "@/modules/shared/ui";
import type { CallToActionBlock as CallToActionBlockProps } from "@/payload-types";

const CTA_PROSE =
    "max-w-none prose-invert prose-headings:text-primary-foreground prose-h2:text-[2rem] prose-h2:leading-[1.08] md:prose-h2:text-[2.5rem] prose-h3:text-2xl prose-p:text-primary-foreground/85 prose-a:text-primary-foreground";

export const CallToActionBlock = ({ links, richText }: CallToActionBlockProps) => (
    <Container>
        <div className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-brand-deep px-6 py-10 text-primary-foreground md:px-12 md:py-14">
            <div
                aria-hidden
                className="absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-primary-foreground/10 blur-3xl"
            />
            <div
                aria-hidden
                className="absolute -bottom-32 left-1/3 -z-10 size-80 rounded-full bg-brand/25 blur-3xl"
            />
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
                <div className="max-w-[44rem]">
                    {richText && (
                        <RichText className={CTA_PROSE} data={richText} enableGutter={false} />
                    )}
                </div>
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                    {(links || []).map(({ link }, index) => {
                        const outline = link.appearance === "outline";
                        return (
                            <CmsLink
                                key={index}
                                size="lg"
                                {...link}
                                appearance={outline ? "outline" : "secondary"}
                                className={cn(
                                    "rounded-full",
                                    outline &&
                                        "border-primary-foreground/50 bg-transparent text-primary-foreground shadow-none hover:border-primary-foreground hover:bg-primary-foreground/10"
                                )}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    </Container>
);
