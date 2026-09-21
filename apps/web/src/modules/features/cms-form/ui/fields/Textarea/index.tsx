import React from "react";

import type { TextField } from "@payloadcms/plugin-form-builder/types";
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from "react-hook-form";

import { Textarea as TextAreaComponent } from "@workspace/ui/components/textarea";
import { FormField } from "@workspace/ui/composites/form-field";

import { useFieldState } from "../../../lib/use-field-state";
import { Width } from "../Width";

export const Textarea: React.FC<
    TextField & {
        errors: Partial<FieldErrorsImpl>;
        register: UseFormRegister<FieldValues>;
        rows?: number;
    }
> = ({ name, defaultValue, label, register, required, rows = 3, width }) => {
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
                <TextAreaComponent
                    defaultValue={defaultValue}
                    id={name}
                    rows={rows}
                    aria-invalid={Boolean(error)}
                    {...register(name, { required })}
                />
            </FormField>
        </Width>
    );
};
