import type { Access, AccessArgs } from "payload";

import type { User } from "@/payload-types";

export const anyone: Access = () => true;

export const authenticated = ({ req: { user } }: AccessArgs<User>): boolean => Boolean(user);

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
    if (user) return true;
    return { _status: { equals: "published" } };
};
