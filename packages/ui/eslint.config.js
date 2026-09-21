import pluginReactHooks from "eslint-plugin-react-hooks";

import { config } from "@workspace/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
    ...config,
    {
        plugins: {
            "react-hooks": pluginReactHooks,
        },
        rules: {
            ...pluginReactHooks.configs.recommended.rules,
        },
    },
];
