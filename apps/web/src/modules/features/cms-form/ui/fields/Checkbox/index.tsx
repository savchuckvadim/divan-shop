import React from "react";

import type { CheckboxField } from "@payloadcms/plugin-form-builder/types";
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { Checkbox as CheckboxUi } from "@workspace/ui/components/checkbox";
import { FormField } from "@workspace/ui/composites/form-field";

import { useFieldState } from "../../../lib/use-field-state";
import { Width } from "../Width";

export const Checkbox: React.FC<
    CheckboxField & {
        errors: Partial<FieldErrorsImpl>;
        register: UseFormRegister<FieldValues>;
    }
> = ({ name, defaultValue, label, register, required, width }) => {
    const props = register(name, { required });
    const { setValue } = useFormContext();
    const { error, requiredLabel } = useFieldState(name);

    return (
        <Width width={width}>
            <FormField
                inline
                label={label}
                htmlFor={name}
                required={required}
                requiredLabel={requiredLabel}
                error={error}
            >
                <CheckboxUi
                    defaultChecked={defaultValue}
                    id={name}
                    aria-invalid={Boolean(error)}
                    {...props}
                    onCheckedChange={(checked) => {
                        setValue(props.name, checked);
                    }}
                />
            </FormField>
        </Width>
    );
};
