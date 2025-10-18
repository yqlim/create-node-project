import path from 'node:path';

import cspell from '@cspell/eslint-plugin';

import type { ConfigWithExtends } from '../types.js';

const configFile: string = path.resolve(
  import.meta.dirname,
  '../../../../cspell.json',
);

export const config: ConfigWithExtends = {
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
