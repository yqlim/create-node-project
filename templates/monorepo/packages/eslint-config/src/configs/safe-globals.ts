import globals from 'globals';

import type { InfiniteDepthConfigWithExtends } from '../types.js';

export const config: InfiniteDepthConfigWithExtends = {
  languageOptions: {
    globals: {
      ...globals['shared-node-browser'],
    },
  },
};

export default config;
