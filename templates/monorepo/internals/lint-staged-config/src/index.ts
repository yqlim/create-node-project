import type { Configuration } from 'lint-staged';

export const config = {
  '*.{js,cjs,mjs,jsx,ts,cts,mts,tsx,mdx}': [
    () => 'tsc --noEmit',
    'eslint --cache --fix --max-warnings 0', // included cspell if using default workspace config
    'prettier --write',
  ],
  '*.{css,html,json,md,sh,xml,yml,yaml}': [
    'cspell lint --no-must-find-files',
    'prettier --write',
  ],
} as const satisfies Configuration;

export default config;
