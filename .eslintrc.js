module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    settings: {
        react: {
            version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    },
    extends: [
        "@dicether/eslint-config",
        "plugin:react/recommended",
    ],
    rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-var-requires": "off",
        "react/no-unescaped-entities": ["error", {"forbid": [">", "}"]}],
        "react/no-deprecated": "off",
    },
};

