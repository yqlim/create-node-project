import globals from 'globals';

import type { ConfigWithExtends } from '../types.js';

export const config: ConfigWithExtends = {
  languageOptions: {
    ecmaVersion: 2017,
    globals: {
      ...globals.es2017,
      ...globals.browser,
    },
  },
};

export default config;
