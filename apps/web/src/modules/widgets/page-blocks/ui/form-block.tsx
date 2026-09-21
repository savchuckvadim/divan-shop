import type { Form } from "@payloadcms/plugin-form-builder/types";

import { CmsForm } from "@/modules/features";
import { isPopulated } from "@/modules/shared/lib";
import type { FormBlock as FormBlockProps } from "@/payload-types";

export const FORM_ANCHOR_ID = "form";

export const FormBlock = ({ form, enableIntro, introContent }: FormBlockProps) => {
    if (!isPopulated(form)) return null;
    return (
        <div id={FORM_ANCHOR_ID} className="scroll-mt-24">
            <CmsForm
                form={form as unknown as Form}
                enableIntro={enableIntro}
                introContent={introContent}
            />
        </div>
    );
};
