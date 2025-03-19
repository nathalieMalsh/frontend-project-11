/* eslint-disable */
import globals from "globals";

import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import babelParser from "@babel/eslint-parser";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended});

export default [
  {
    languageOptions: {
      globals: globals.node, // Глобальные переменные для Node.js
      ecmaVersion: "latest", // Используем последнюю версию ECMAScript
      sourceType: "module", // Указываем, что используем ES-модули
      parser: babelParser, // Используем Babel для парсинга
      parserOptions: {
        requireConfigFile: false, // Не используем отдельный конфиг Babel
        babelOptions: {
          presets: ["@babel/preset-env"], // Используем preset-env для поддержки современного JS
        },
      },
    },
  },
  ...compat.extends("airbnb"), // Подключаем конфигурацию Airbnb
];
/* eslint-enable */
