import { defineConfig } from 'eslint/config';

import { config as configBrowser } from '../configs/browser.js';
import { config as configMdx } from '../configs/mdx.js';
import { config as configReact } from '../configs/react.js';
import { configs as configsBase } from './base.js';

import type { Config } from '../types.js';

export const configs: Config[] = defineConfig(
  configsBase,
  configBrowser,
  configReact,
  configMdx,
);

export default configs;
