import path from 'node:path';

import cspell from '@cspell/eslint-plugin';

import type { InfiniteDepthConfigWithExtends } from '../types.js';

const configFile: string = path.resolve(
  import.meta.dirname,
  '../../../../cspell.json',
);

export const config: InfiniteDepthConfigWithExtends = {
  plugins: {
    '@cspell': cspell,
  },
  rules: {
    '@cspell/spellchecker': [
      'warn',
      {
        configFile,
      },
    ],
  },
};

export default config;
