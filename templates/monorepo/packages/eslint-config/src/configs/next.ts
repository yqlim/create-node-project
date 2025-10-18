import nextPlugin from '@next/eslint-plugin-next';

import type { ConfigWithExtends } from '../types.js';

export const config: ConfigWithExtends = {
  plugins: {
    '@next/next': nextPlugin,
  },
  rules: {
    ...(nextPlugin.configs.recommended.rules ?? {}),
    ...(nextPlugin.configs['core-web-vitals'].rules ?? {}),
  },
};

export default config;
