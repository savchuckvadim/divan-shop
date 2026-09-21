import type { ReactNode } from "react";

import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";

interface FormFieldProps {
    id: string;
    label: string;
    hint?: string;
    error?: string;
    className?: string;
    children: ReactNode;
}

export const FormField = ({ id, label, hint, error, className, children }: FormFieldProps) => (
    <div className={cn("flex flex-col gap-2", className)}>
        <Label htmlFor={id}>{label}</Label>
        {children}
        {hint && !error && (
            <p id={`${id}-hint`} className="text-xs text-muted-foreground">
                {hint}
            </p>
        )}
        {error && (
            <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
                {error}
            </p>
        )}
    </div>
);
