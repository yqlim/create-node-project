import { globalIgnores } from 'eslint/config';

import type { ConfigWithExtends } from '../types.js';

export const config: ConfigWithExtends = globalIgnores([
  'build',
  'dist',
  'generated',
  'node_modules',
  'out',
]);

export default config;
