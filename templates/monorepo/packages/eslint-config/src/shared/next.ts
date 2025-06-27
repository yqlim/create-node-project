import tsEslint from 'typescript-eslint';

import { config as configNext } from '../configs/next.js';
import { config as configServer } from '../configs/server.js';
import { js, ts, withDir, withExt } from '../extensions.js';
import { configs as configsReact } from './react.js';

import type { InfiniteDepthConfigWithExtends } from '../types.js';

export const configs: InfiniteDepthConfigWithExtends[] = tsEslint.config(
  configsReact,
  configNext,
  {
    files: [
      ...withDir(['**/{server,api}/**'], withExt(['*'], [...js, ...ts])),
      ...withExt(['*.server'], [...js, ...ts]),
    ],
    extends: [configServer],
  },
);

export default configs;
