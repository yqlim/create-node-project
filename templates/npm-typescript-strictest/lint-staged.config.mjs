/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{js,cjs,mjs,jsx,ts,cts,mts,tsx,mdx}': [
    'eslint --cache --fix --max-warnings 0',
    'prettier --write',
    () => 'tsc --noEmit',
  ],
  '*.{css,html,json,md,sh,xml,yml,yaml}': ['cspell lint', 'prettier --write'],
};
