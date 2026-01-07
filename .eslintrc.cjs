module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb",
    "airbnb/hooks",
    "plugin:react/jsx-runtime",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.js"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: { version: "18.2" },
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
        extensions: [".js", ".jsx", ".json"],
      },
    },
  },
  plugins: ["react-refresh"],
  rules: {
    // React Refresh
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    // 允許 JSX 在 .jsx 檔案中使用
    "react/jsx-filename-extension": ["error", { extensions: [".jsx"] }],
    // 關閉 prop-types（使用 TypeScript 或不需要）
    "react/prop-types": "off",
    // 允許使用 _ 開頭的未使用變數（用於解構時忽略屬性）
    "no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    // 關閉 default export 偏好
    "import/prefer-default-export": "off",
    // 允許 console（開發用）
    "no-console": "warn",
    // 允許在箭頭函數中使用簡潔語法
    "arrow-body-style": ["error", "as-needed"],
  },
};
