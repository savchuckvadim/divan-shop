import { Container } from "@workspace/ui/components/container";

import { CmsLink, Media, RichText } from "@/modules/shared/ui";
import type { Page } from "@/payload-types";

export const MediumImpactHero = ({ links, media, richText }: Page["hero"]) => (
    <section className="pt-12">
        <Container className="mb-8">
            {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
            {Array.isArray(links) && links.length > 0 && (
                <ul className="flex flex-wrap gap-4">
                    {links.map(({ link }, index) => (
                        <li key={index}>
                            <CmsLink {...link} />
                        </li>
                    ))}
                </ul>
            )}
        </Container>
        <Container>
            {typeof media === "object" && media && (
                <Media
                    priority
                    resource={media}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    imgClassName="w-full rounded-2xl border border-border object-cover"
                />
            )}
        </Container>
    </section>
);
