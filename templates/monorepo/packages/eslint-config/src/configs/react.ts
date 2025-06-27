import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';

import { jsx, mdx, tsx, withExt } from '../extensions.js';

import type { InfiniteDepthConfigWithExtends } from '../types.js';

export const config: InfiniteDepthConfigWithExtends = [
  {
    files: withExt(['*'], [...jsx, ...tsx, ...mdx]),
    plugins: {
      'jsx-a11y': jsxA11yPlugin,
      react: reactPlugin,
      'react-hooks': hooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...(reactPlugin.configs.flat.recommended.rules ?? {}),
      ...(hooksPlugin.configs.recommended.rules ?? {}),
      ...(jsxA11yPlugin.flatConfigs.recommended.rules ?? {}),
    },
  },
];

export default config;
