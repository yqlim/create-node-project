import tsEslint from 'typescript-eslint';

import type { InfiniteDepthConfigWithExtends } from '../types.js';

export const config: InfiniteDepthConfigWithExtends = {
  ...tsEslint.configs.disableTypeChecked,
};

export default config;
