import type { Form } from "@payloadcms/plugin-form-builder/types";

import { CmsForm } from "@/modules/features";
import { isPopulated } from "@/modules/shared/lib";
import type { FormBlock as FormBlockProps } from "@/payload-types";

export const FormBlock = ({ form, enableIntro, introContent }: FormBlockProps) => {
    if (!isPopulated(form)) return null;
    return (
        <CmsForm
            form={form as unknown as Form}
            enableIntro={enableIntro}
            introContent={introContent}
        />
    );
};
