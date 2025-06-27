import type { InfiniteDepthConfigWithExtends } from '../types.js';

export const config: InfiniteDepthConfigWithExtends = {
  ignores: [
    '**/build/',
    '**/dist/',
    '**/generated/',
    '**/node_modules/',
    '**/out/',
  ],
};

export default config;
