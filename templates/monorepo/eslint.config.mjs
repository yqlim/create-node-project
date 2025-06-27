import { configs } from '@packages/eslint-config/shared/base.js';
import tsEslint from 'typescript-eslint';

export default tsEslint.config(
  {
    ignores: ['apps/', 'packages/'],
  },
  ...configs,
);
