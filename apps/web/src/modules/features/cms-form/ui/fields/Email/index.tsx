import React from "react";

import type { EmailField } from "@payloadcms/plugin-form-builder/types";
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from "react-hook-form";

import { Input } from "@workspace/ui/components/input";
import { FormField } from "@workspace/ui/composites/form-field";

import { useFieldState } from "../../../lib/use-field-state";
import { Width } from "../Width";

export const Email: React.FC<
    EmailField & {
        errors: Partial<FieldErrorsImpl>;
        register: UseFormRegister<FieldValues>;
    }
> = ({ name, defaultValue, label, register, required, width }) => {
    const { error, requiredLabel } = useFieldState(name);

    return (
        <Width width={width}>
            <FormField
                label={label}
                htmlFor={name}
                required={required}
                requiredLabel={requiredLabel}
                error={error}
            >
                <Input
                    defaultValue={defaultValue}
                    id={name}
                    type="text"
                    aria-invalid={Boolean(error)}
                    {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required })}
                />
            </FormField>
        </Width>
    );
};
