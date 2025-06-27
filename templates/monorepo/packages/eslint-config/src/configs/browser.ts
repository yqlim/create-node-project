import globals from 'globals';

import type { InfiniteDepthConfigWithExtends } from '../types.js';

export const config: InfiniteDepthConfigWithExtends = {
  languageOptions: {
    ecmaVersion: 2017,
    globals: {
      ...globals.es2017,
      ...globals.browser,
    },
  },
};

export default config;
