import * as mdx from 'eslint-plugin-mdx';

import { config as configReact } from './react.js';
import { config as configTypeDisabled } from './typescript-disabled.js';

import type { InfiniteDepthConfigWithExtends } from '../types.js';

export const config: InfiniteDepthConfigWithExtends = [
  {
    ...mdx.flat,
    extends: [configTypeDisabled, configReact],
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
      languageMapper: {},
    }),
  },
  {
    ...mdx.flatCodeBlocks,
    extends: [configTypeDisabled, configReact],
    rules: {
      ...mdx.flatCodeBlocks.rules,
    },
  },
];
