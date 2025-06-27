import tsEslint from 'typescript-eslint';

import { config as configBrowser } from '../configs/browser.js';
import { config as configMdx } from '../configs/mdx.js';
import { config as configReact } from '../configs/react.js';
import { configs as configsBase } from './base.js';

import type { InfiniteDepthConfigWithExtends } from '../types.js';

export const configs: InfiniteDepthConfigWithExtends[] = tsEslint.config(
  configsBase,
  configBrowser,
  configReact,
  configMdx,
);

export default configs;
