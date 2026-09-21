module.exports = {
    semi: true,
    singleQuote: false,
    tabWidth: 4,
    useTabs: false,
    trailingComma: "es5",
    printWidth: 100,
    arrowParens: "always",
    endOfLine: "lf",

    plugins: ["@trivago/prettier-plugin-sort-imports"],

    importOrder: [
        "^react$",
        "^next",
        "^react-dom",
        "<THIRD_PARTY_MODULES>",
        "^@workspace",
        "^@/",
        "^[./]",
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderCaseInsensitive: true,

    overrides: [
        {
            files: ["*.json", "*.md"],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
