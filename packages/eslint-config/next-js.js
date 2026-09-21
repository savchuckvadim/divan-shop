import pluginNext from "@next/eslint-plugin-next";
import pluginReactHooks from "eslint-plugin-react-hooks";

import { config as baseConfig } from "./base.js";

/** @type {import("eslint").Linter.Config[]} */
export const nextJsConfig = [
    ...baseConfig,
    {
        plugins: {
            "@next/next": pluginNext,
        },
        rules: {
            ...pluginNext.configs.recommended.rules,
            ...pluginNext.configs["core-web-vitals"].rules,
        },
    },
    {
        plugins: {
            "react-hooks": pluginReactHooks,
        },
        rules: {
            ...pluginReactHooks.configs.recommended.rules,
        },
    },
];
