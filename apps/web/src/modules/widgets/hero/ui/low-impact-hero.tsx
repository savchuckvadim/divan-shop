import type { ReactNode } from "react";

import { Container } from "@workspace/ui/components/container";

import { RichText } from "@/modules/shared/ui";
import type { Page } from "@/payload-types";

type LowImpactHeroProps = Partial<Pick<Page["hero"], "richText">> & { children?: ReactNode };

export const LowImpactHero = ({ children, richText }: LowImpactHeroProps) => (
    <Container className="pt-12">
        <div className="max-w-[48rem]">
            {children || (richText && <RichText data={richText} enableGutter={false} />)}
        </div>
    </Container>
);
