import storybook from 'eslint-plugin-storybook';

import type { InfiniteDepthConfigWithExtends } from '../types.js';

export const config: InfiniteDepthConfigWithExtends = [
  {
    ignores: ['!.storybook/'],
  },
  storybook.configs['flat/recommended'],
  {
    files: ['.storybook/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['.storybook/*.ts'],
        },
        tsconfigRootDir: process.cwd(),
      },
    },
  },
];

export default config;
