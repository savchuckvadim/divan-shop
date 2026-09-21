import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@workspace/ui/components/container";
import { Heading } from "@workspace/ui/components/heading";
import { Text } from "@workspace/ui/components/text";

import { type Locale, ROUTES } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";

export const NotFoundPage = ({ locale }: { locale: Locale }) => {
    const { notFound } = getDictionary(locale);

    return (
        <Container className="flex flex-col items-start gap-4 py-28">
            <Heading as="h1" size="xl">
                404 · {notFound.title}
            </Heading>
            <Text muted>{notFound.text}</Text>
            <Button asChild>
                <Link href={ROUTES.home(locale)}>{notFound.goHome}</Link>
            </Button>
        </Container>
    );
};
