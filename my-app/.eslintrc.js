module.exports = {
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    // "plugin:jsx-a11y/recommended"
  ],
  "plugins": [
    "react",
    "@typescript-eslint",
    // "jsx-a11y",
    "unused-imports"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    // "jsx-a11y/anchor-is-valid": [
    //   "error",
    //   {
    //     "components": [
    //       "Link"
    //     ],
    //     "specialLink": [
    //       "hrefLeft",
    //       "hrefRight"
    //     ],
    //     "aspects": [
    //       "invalidHref",
    //       "preferButton"
    //     ]
    //   }
    // ],
    "no-console": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "unused-imports/no-unused-imports-ts": "warn",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "@typescript-eslint/ban-types": "off"
  }
}
