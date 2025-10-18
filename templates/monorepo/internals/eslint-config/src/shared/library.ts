import { defineConfig } from 'eslint/config';

import { config as configBrowser } from '../configs/browser.js';
import { config as configServer } from '../configs/server.js';
import { js, jsx, ts, tsx, withExt } from '../extensions.js';
import { configs as configsBase } from './base.js';

import type { Config } from '../types.js';

export const configs: Config[] = defineConfig(
  configsBase,
  {
    files: [...withExt(['*.server', '**/server/**/*'], [...js, ...ts])],
    extends: [configServer],
  },
  {
    files: [
      ...withExt(
        ['*.client', '**/client/**/*'],
        [...js, ...jsx, ...ts, ...tsx],
      ),
    ],
    extends: [configBrowser],
  },
);

export default configs;
