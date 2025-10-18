import { config as configJsDoc } from '../configs/jsdoc.js';
import { config as configPkg } from '../configs/pkg.js';
import { config as configSortImport } from '../configs/sort-imports.js';
import { mergeConfig } from '../utils.js';

import type { Config } from 'prettier';

export const config: Config = mergeConfig(
  {
    singleQuote: true,
  },
  configSortImport,
  configJsDoc,
  configPkg,
);

export default config;
