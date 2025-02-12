/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{js,cjs,mjs,jsx,ts,cts,mts,tsx,mdx}': ['prettier --write'],
  '*.{css,html,json,md,sh,xml,yml,yaml}': 'prettier --write',
};
