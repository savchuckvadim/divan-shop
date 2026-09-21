import { nextJsConfig } from "@workspace/eslint-config/next-js";

export default [
    ...nextJsConfig,
    {
        ignores: [".next/", "src/payload-types.ts", "src/app/(payload)/admin/importMap.js"],
    },
];
