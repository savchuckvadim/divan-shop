import { Container } from "@workspace/ui/components/container";

import { isPopulated } from "@/modules/shared/lib";
import { Media, RichText } from "@/modules/shared/ui";
import type { MediaBlock as MediaBlockProps } from "@/payload-types";

export const MediaBlock = ({ media }: MediaBlockProps) => {
    const caption = isPopulated(media) ? media.caption : undefined;

    return (
        <Container>
            <Media
                resource={media}
                sizes="(max-width: 1280px) 100vw, 1280px"
                imgClassName="w-full rounded-2xl border border-border"
            />
            {caption && (
                <div className="mt-4">
                    <RichText
                        data={caption}
                        enableGutter={false}
                        className="text-sm text-muted-foreground"
                    />
                </div>
            )}
        </Container>
    );
};
