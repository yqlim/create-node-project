import tsEslint from 'typescript-eslint';

import type { ConfigWithExtends } from '../types.js';

export const config: ConfigWithExtends = {
  plugins: {
    '@typescript-eslint': tsEslint.plugin,
  },
  ...tsEslint.configs.disableTypeChecked,
};

export default config;
