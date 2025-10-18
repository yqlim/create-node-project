import type { Config } from 'prettier';

/**
 * Merges multiple Prettier configurations into one. It takes care of plugin
 * merging by concatenating the plugin arrays from each configuration.
 */
export function mergeConfig(
  config1: Config,
  config2: Config,
  ...configs: Config[]
): Config;
export function mergeConfig(...configs: Config[]): Config {
  return configs.reduce<Config>(
    (acc, config) => ({
      ...acc,
      ...config,
      plugins: Array.from(
        new Set([...(acc.plugins ?? []), ...(config.plugins ?? [])]),
      ),
    }),
    {},
  );
}
