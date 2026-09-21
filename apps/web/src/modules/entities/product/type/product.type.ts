import type { Product } from "@/payload-types";

export type { Product };

export type ProductAvailability = Product["availability"];

export type ProductSpecs = NonNullable<Product["specs"]>;

export type ProductMaterial = NonNullable<ProductSpecs["material"]>;

export type ProductMechanism = NonNullable<ProductSpecs["mechanism"]>;

export interface ProductSlugEntry {
    slug: string;
    updatedAt: string;
}
