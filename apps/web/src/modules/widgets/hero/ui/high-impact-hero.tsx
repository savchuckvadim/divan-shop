import { Container } from "@workspace/ui/components/container";

import { CmsLink, Media, RichText } from "@/modules/shared/ui";
import type { Page } from "@/payload-types";

export const HighImpactHero = ({ links, media, richText }: Page["hero"]) => (
    <section className="relative flex min-h-[70vh] items-center text-white" data-theme="dark">
        <Container className="relative z-10 py-24">
            <div className="max-w-[40rem]">
                {richText && <RichText className="mb-8" data={richText} enableGutter={false} />}
                {Array.isArray(links) && links.length > 0 && (
                    <ul className="flex flex-wrap gap-4">
                        {links.map(({ link }, index) => (
                            <li key={index}>
                                <CmsLink {...link} size="lg" />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Container>
        {typeof media === "object" && media && (
            <Media
                fill
                priority
                resource={media}
                sizes="100vw"
                imgClassName="-z-10 object-cover brightness-[0.55]"
            />
        )}
    </section>
);
