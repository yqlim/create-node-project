import { defineConfig } from 'eslint/config';

import { config as configNext } from '../configs/next.js';
import { config as configServer } from '../configs/server.js';
import { js, ts, withDir, withExt } from '../extensions.js';
import { configs as configsReact } from './react.js';

import type { Config } from '../types.js';

export const configs: Config[] = defineConfig(configsReact, configNext, {
  files: [
    ...withDir(['**/{server,api}/**'], withExt(['*'], [...js, ...ts])),
    ...withExt(['*.server'], [...js, ...ts]),
  ],
  extends: [configServer],
});

export default configs;
