import type { ReactNode } from "react";

import { Card } from "@workspace/ui/composites/card";

import { Logo } from "@/modules/shared/ui";

interface AuthCardProps {
    title: ReactNode;
    description?: ReactNode;
    children: ReactNode;
}

export const AuthCard = ({ title, description, children }: AuthCardProps) => (
    <Card
        className="mx-auto w-full max-w-md"
        media={
            <div data-slot="stage" className="flex items-center justify-center py-8">
                <Logo size="lg" />
            </div>
        }
        title={title}
        description={description}
    >
        {children}
    </Card>
);
