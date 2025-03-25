import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["**/lib", "**/dist", "**/typings"]),
    {
        extends: compat.extends("@dicether/eslint-config", "plugin:react/recommended"),

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        rules: {
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-var-requires": "off",

            "react/no-unescaped-entities": ["error", {
                forbid: [">", "}"],
            }],

            "react/no-deprecated": "off",
        },
    },
    {
        files: ["webpack/*.js"],
        rules: {
            "@typescript-eslint/no-require-imports": "off",
        },
    },
]);