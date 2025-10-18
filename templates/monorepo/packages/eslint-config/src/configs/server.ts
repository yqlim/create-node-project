import globals from 'globals';

import type { ConfigWithExtends } from '../types.js';

export const config: ConfigWithExtends = {
  languageOptions: {
    ecmaVersion: 2024,
    globals: {
      ...globals.es2024,
      ...globals.node,
    },
  },
};

export default config;
