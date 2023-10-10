module.exports = {
  env: {
    browser: true,
    jest: true
  },
  extends: ["airbnb", "prettier", "prettier/react", "plugin:storybook/recommended"],
  plugins: ["prettier", "react-hooks"],
  rules: {
    "prettier/prettier": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error"
  }
};
