import type { Access, AccessArgs, TypedUser } from "payload";

export const anyone: Access = () => true;

export const isAdminUser = (user: null | TypedUser | undefined): boolean =>
    user?.collection === "users";

export const isCustomerUser = (user: null | TypedUser | undefined): boolean =>
    user?.collection === "customers";

export const authenticated = ({ req: { user } }: AccessArgs): boolean => isAdminUser(user);

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
    if (isAdminUser(user)) return true;
    return { _status: { equals: "published" } };
};
