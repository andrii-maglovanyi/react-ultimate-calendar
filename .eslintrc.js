module.exports = {
  env: {
    browser: true,
    jest: true
  },
  extends: ["airbnb", "prettier", "prettier/react"],
  plugins: ["prettier", "react-hooks"],
  rules: {
    "prettier/prettier": "error",
    "react/jsx-filename-extension": ["warn", { extensions: [".js"] }],
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error"
  }
};
