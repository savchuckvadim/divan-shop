import { ChevronDownIcon } from "lucide-react";

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
                <Heading as="h2" size="md" className="mb-8">
                    {title}
                </Heading>
            )}
            <div className="divide-y divide-border/70 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                {items.map((item, index) => (
                    <details key={item.id ?? index} className="group">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                            <span className="font-serif text-lg font-medium leading-snug">
                                {item.question}
                            </span>
                            <ChevronDownIcon
                                aria-hidden
                                className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-soft group-open:rotate-180"
                            />
                        </summary>
                        <RichText
                            data={item.answer}
                            enableGutter={false}
                            className="max-w-none px-5 pb-5 text-muted-foreground"
                        />
                    </details>
                ))}
            </div>
        </Container>
    );
};
