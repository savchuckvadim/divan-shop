import type { Locale } from "@/modules/shared/config";
import type { Page } from "@/payload-types";

import { CallToActionBlock } from "./call-to-action-block";
import { ContentBlock } from "./content-block";
import { FormBlock } from "./form-block";
import { MediaBlock } from "./media-block";
import { ProductArchiveBlock } from "./product-archive-block";

type LayoutBlock = Page["layout"][number];

interface RenderBlocksProps {
    blocks: LayoutBlock[] | null | undefined;
    locale: Locale;
}

const renderBlock = (block: LayoutBlock, locale: Locale) => {
    switch (block.blockType) {
        case "content":
            return <ContentBlock {...block} />;
        case "cta":
            return <CallToActionBlock {...block} />;
        case "mediaBlock":
            return <MediaBlock {...block} />;
        case "productArchive":
            return <ProductArchiveBlock {...block} id={block.id ?? undefined} locale={locale} />;
        case "formBlock":
            return <FormBlock {...block} />;
        default:
            return null;
    }
};

export const RenderBlocks = ({ blocks, locale }: RenderBlocksProps) => {
    if (!blocks?.length) return null;

    return (
        <>
            {blocks.map((block, index) => (
                <section key={block.id ?? index} className="my-16">
                    {renderBlock(block, locale)}
                </section>
            ))}
        </>
    );
};
