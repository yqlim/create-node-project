import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';

import 'eslint-plugin-only-warn';

import { config as configCSpell } from '../configs/cspell.js';
import { config as configIgnores } from '../configs/ignores.js';
import { config as configSafeGlobals } from '../configs/safe-globals.js';
import { config as configServer } from '../configs/server.js';
import { config as configTypescriptDisabled } from '../configs/typescript-disabled.js';
import { config as configTypescript } from '../configs/typescript.js';

import type { InfiniteDepthConfigWithExtends } from '../types.js';

export const configs: InfiniteDepthConfigWithExtends[] = tsEslint.config(
  configIgnores,
  eslint.configs.recommended,
  configTypescript,
  configSafeGlobals,
  configCSpell,
  {
    files: [
      '*.config.{js,cjs,mjs,ts,cts,mts}',
      'config/**/*.{js,cjs,mjs,ts,cts,mts}',
    ],
    extends: [configTypescriptDisabled, configServer],
  },
);

export default configs;
