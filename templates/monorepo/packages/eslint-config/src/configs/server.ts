import globals from 'globals';

import type { InfiniteDepthConfigWithExtends } from '../types.js';

export const config: InfiniteDepthConfigWithExtends = {
  languageOptions: {
    ecmaVersion: 2024,
    globals: {
      ...globals.es2024,
      ...globals.node,
    },
  },
};

export default config;
