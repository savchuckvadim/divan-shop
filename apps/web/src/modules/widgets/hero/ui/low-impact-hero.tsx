import type { ReactNode } from "react";

import { Container } from "@workspace/ui/components/container";
import { Text } from "@workspace/ui/components/text";

import type { Locale } from "@/modules/shared/config";
import { RichText } from "@/modules/shared/ui";
import type { Page } from "@/payload-types";

import { HERO_PROSE } from "../lib/hero-prose";

type LowImpactHeroProps = Partial<Pick<Page["hero"], "richText">> & {
    children?: ReactNode;
    eyebrow?: ReactNode;
    locale?: Locale;
};

export const LowImpactHero = ({ children, richText, eyebrow }: LowImpactHeroProps) => (
    <Container className="pt-12 md:pt-16">
        <div className="flex max-w-[48rem] flex-col gap-4">
            {eyebrow && (
                <Text as="span" eyebrow className="text-primary">
                    {eyebrow}
                </Text>
            )}
            {children ||
                (richText && (
                    <RichText className={HERO_PROSE} data={richText} enableGutter={false} />
                ))}
        </div>
        <div aria-hidden className="mt-10 h-px bg-horizon md:mt-12" />
    </Container>
);
