import { Container } from "@workspace/ui/components/container";

import { CmsLink, RichText } from "@/modules/shared/ui";
import type { CallToActionBlock as CallToActionBlockProps } from "@/payload-types";

export const CallToActionBlock = ({ links, richText }: CallToActionBlockProps) => (
    <Container>
        <div className="flex flex-col gap-8 rounded-2xl border border-border bg-secondary/50 p-6 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="flex max-w-[48rem] items-center">
                {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
                {(links || []).map(({ link }, index) => (
                    <CmsLink key={index} size="lg" {...link} />
                ))}
            </div>
        </div>
    </Container>
);
