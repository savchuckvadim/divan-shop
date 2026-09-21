import { Container } from "@workspace/ui/components/container";

import { isPopulated } from "@/modules/shared/lib";
import { Media, RichText } from "@/modules/shared/ui";
import type { MediaBlock as MediaBlockProps } from "@/payload-types";

export const MediaBlock = ({ media }: MediaBlockProps) => {
    const caption = isPopulated(media) ? media.caption : undefined;

    return (
        <Container>
            <figure className="flex flex-col gap-4">
                <Media
                    resource={media}
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    imgClassName="w-full rounded-2xl shadow-card"
                />
                {caption && (
                    <figcaption className="max-w-[65ch]">
                        <RichText
                            data={caption}
                            enableGutter={false}
                            className="max-w-none text-sm text-muted-foreground"
                        />
                    </figcaption>
                )}
            </figure>
        </Container>
    );
};
