import type { ReactNode } from "react";

import { Card } from "@workspace/ui/composites/card";

import { LogoMark } from "@/modules/shared/ui";

interface AuthCardProps {
    title: ReactNode;
    description?: ReactNode;
    children: ReactNode;
}

export const AuthCard = ({ title, description, children }: AuthCardProps) => (
    <Card
        className="mx-auto w-full max-w-md"
        media={
            <div className="flex items-center justify-center bg-hero py-7">
                <LogoMark className="size-11" />
            </div>
        }
        title={title}
        description={description}
    >
        {children}
    </Card>
);
