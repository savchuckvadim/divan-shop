import { cn } from "@workspace/ui/lib/utils";

import { SITE } from "@/modules/shared/config";

interface LogoProps {
    className?: string;
    name?: string | null;
}

export const Logo = ({ className, name }: LogoProps) => (
    <span
        className={cn(
            "font-serif text-2xl font-semibold tracking-tight text-foreground",
            className
        )}
    >
        {name || SITE.name}
    </span>
);
