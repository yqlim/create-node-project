import nextPlugin from '@next/eslint-plugin-next';

import type { InfiniteDepthConfigWithExtends } from '../types.js';

export const config: InfiniteDepthConfigWithExtends = {
  plugins: {
    '@next/next': nextPlugin,
  },
  rules: {
    ...(nextPlugin.configs.recommended.rules ?? {}),
    ...(nextPlugin.configs['core-web-vitals'].rules ?? {}),
  },
};

export default config;
