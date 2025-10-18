import globals from 'globals';

import type { ConfigWithExtends } from '../types.js';

export const config: ConfigWithExtends = {
  languageOptions: {
    globals: {
      ...globals['shared-node-browser'],
    },
  },
};

export default config;
