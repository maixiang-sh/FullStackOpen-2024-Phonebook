// eslint.config.mjs
export default {
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    globals: {
      process: "readonly",
      require: "readonly",
      module: "readonly",
      __dirname: "readonly",
      __filename: "readonly",
    },
  },
  rules: {},
};
