// @ts-check
import angular from "angular-eslint";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/",
      ".angular/",
      ".cache/",
      "node_modules/",
      "Library/",
      "public/",
      "vite.config.ts"
    ]
  },
  {
    files: ["**/*.ts"],
    extends: [
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "portfolio",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "portfolio",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@angular-eslint/prefer-on-push-component-change-detection": "error",
      "@angular-eslint/prefer-standalone": "error",
      "@angular-eslint/use-lifecycle-interface": "error",
      "@angular-eslint/sort-lifecycle-methods": "error",
      "no-restricted-globals": [
        "error",
        {
          "name": "window",
          "message": "Direct access to window is not SSR compatible. Use afterNextRender or standard Angular platform injection."
        },
        {
          "name": "document",
          "message": "Direct access to document is not SSR compatible. Use afterNextRender or standard Angular platform injection."
        }
      ]
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
