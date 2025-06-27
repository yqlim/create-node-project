import type { Config } from 'prettier';
import type { Options as PluginConfig } from 'prettier-plugin-jsdoc';

export const config: Config & PluginConfig = {
  plugins: ['prettier-plugin-jsdoc'],
  jsdocCommentLineStrategy: 'multiline',
  jsdocPreferCodeFences: true,
  tsdoc: true,
};

export default config;
