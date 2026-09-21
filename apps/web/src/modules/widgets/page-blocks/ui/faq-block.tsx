import { Container } from "@workspace/ui/components/container";
import { Heading } from "@workspace/ui/components/heading";

import { lexicalToPlainText } from "@/modules/shared/lib";
import { faqJsonLd, JsonLd } from "@/modules/shared/seo";
import { RichText } from "@/modules/shared/ui";
import type { FaqBlock as FaqBlockProps } from "@/payload-types";

export const FaqBlock = ({ title, items }: FaqBlockProps) => {
    if (!items?.length) return null;

    return (
        <Container className="max-w-[48rem]">
            <JsonLd
                data={faqJsonLd(
                    items.map((item) => ({
                        question: item.question,
                        answer: lexicalToPlainText(item.answer),
                    }))
                )}
            />
            {title && (
                <Heading as="h2" size="md" className="mb-6">
                    {title}
                </Heading>
            )}
            <div className="divide-y divide-border rounded-2xl border border-border">
                {items.map((item, index) => (
                    <details key={item.id ?? index} className="group px-5 py-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                            <span>{item.question}</span>
                            <span
                                aria-hidden
                                className="text-muted-foreground transition-transform group-open:rotate-45"
                            >
                                +
                            </span>
                        </summary>
                        <RichText
                            data={item.answer}
                            enableGutter={false}
                            className="mt-3 text-muted-foreground"
                        />
                    </details>
                ))}
            </div>
        </Container>
    );
};
