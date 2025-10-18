import { configs } from '@internals/eslint-config/shared/base.js';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: ['apps/', 'internals/', 'packages/'],
  },
  ...configs,
);
