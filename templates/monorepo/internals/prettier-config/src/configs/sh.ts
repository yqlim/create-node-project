import type { Config } from 'prettier';
import type { ShParserOptions as PluginConfig } from 'prettier-plugin-sh';

export const config: Config & Partial<PluginConfig> = {
  plugins: ['prettier-plugin-sh'],
};

export default config;
