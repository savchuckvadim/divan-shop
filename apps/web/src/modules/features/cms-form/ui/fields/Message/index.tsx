import React from "react";

import { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";

import { RichText } from "@/modules/shared/ui";

import { Width } from "../Width";

export const Message: React.FC<{ message: DefaultTypedEditorState }> = ({ message }) => {
    return (
        <Width className="my-12" width="100">
            {message && <RichText data={message} />}
        </Width>
    );
};
