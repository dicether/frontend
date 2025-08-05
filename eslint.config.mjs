import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import dicetherEsLint from "@dicether/eslint-config";
import reactPlugin from "eslint-plugin-react";

export default defineConfig([globalIgnores(["**/lib", "**/dist", "**/typings"]),
    dicetherEsLint,
    reactPlugin.configs.flat.recommended,
    {
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

            //TODO: Fix this warnings
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-enum-comparison": "off",
            "@typescript-eslint/no-unsafe-return": "off",

            "react/no-unescaped-entities": ["error", {
                forbid: [">", "}"],
            }],

            "react/no-deprecated": "off",
        },
    },
    {
        files: ["webpack/*.js", "postcss.config.js"],
        rules: {
            "@typescript-eslint/no-require-imports": "off",
        },
    },
]);