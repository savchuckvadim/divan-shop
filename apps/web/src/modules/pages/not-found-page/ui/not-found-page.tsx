import Link from "next/link";

import { CompassIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Container } from "@workspace/ui/components/container";
import { EmptyState } from "@workspace/ui/composites/empty-state";

import { type Locale, ROUTES } from "@/modules/shared/config";
import { getDictionary } from "@/modules/shared/i18n";

export const NotFoundPage = ({ locale }: { locale: Locale }) => {
    const { notFound } = getDictionary(locale);

    return (
        <Container className="py-24 md:py-32">
            <EmptyState
                as="h1"
                icon={<CompassIcon />}
                title={`404 · ${notFound.title}`}
                description={notFound.text}
                action={
                    <Button asChild>
                        <Link href={ROUTES.home(locale)}>{notFound.goHome}</Link>
                    </Button>
                }
            />
        </Container>
    );
};
