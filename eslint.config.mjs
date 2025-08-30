import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            // React/JSX rules
            "react/no-unescaped-entities": "off",
            "jsx-a11y/alt-text": "off",

            // TypeScript rules
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "off",

            // JavaScript rules
            "prefer-const": "off",
        }
    }
];

export default eslintConfig;
