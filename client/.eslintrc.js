module.exports = {
  extends: ["airbnb-typescript-prettier"],
  overrides: [
    {
      files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
      rules: {
        "react-hooks/exhaustive-deps": "off",
      },
    },
  ],
};
