// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            "unused-imports": unusedImports,
        },
    },
    {
        ignores: ["dist/"]
    },
    {
        rules: {
            // note you must disable the base rule as it can report incorrect errors
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error'],
            'indent': ["error", 4],
            "unused-imports/no-unused-imports": "error",
        },
    },
);