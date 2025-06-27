declare module '@next/eslint-plugin-next' {
  import type { ESLint } from 'eslint';
  import type { Config as PromisableConfig } from 'typescript-eslint';

  type ConfigArray = Exclude<PromisableConfig, Promise<unknown>>;
  type Config = ConfigArray[number];

  type Plugin = {
    configs: {
      recommended: Config;
      'core-web-vitals': Config;
    };
  } & ESLint.Plugin;

  const plugin: Plugin;

  export = plugin;
}

declare module 'eslint-plugin-jsx-a11y' {
  import type { ESLint } from 'eslint';
  import type { Config as PromisableConfig } from 'typescript-eslint';

  type ConfigArray = Exclude<PromisableConfig, Promise<unknown>>;
  type Config = ConfigArray[number];

  type Plugin = {
    flatConfigs: {
      recommended: Config;
      strict: Config;
    };
  } & ESLint.Plugin;

  const plugin: Plugin;

  export = plugin;
}

declare module 'eslint-plugin-only-warn' {
  type OnlyWarn = {
    enable: () => void;
    disable: () => void;
  };

  const plugin: OnlyWarn;

  export = plugin;
}

declare module 'eslint-plugin-react' {
  import type { ESLint } from 'eslint';
  import type { Config as PromisableConfig } from 'typescript-eslint';

  type ConfigArray = Exclude<PromisableConfig, Promise<unknown>>;
  type Config = ConfigArray[number];

  type Plugin = {
    configs: {
      flat: {
        all: Config;
        'jsx-runtime': Config;
        recommended: Config;
      };
    };
  } & ESLint.Plugin;

  const plugin: Plugin;

  export = plugin;
}

declare module 'eslint-plugin-react-hooks' {
  import type { ESLint } from 'eslint';
  import type { Config as PromisableConfig } from 'typescript-eslint';

  type ConfigArray = Exclude<PromisableConfig, Promise<unknown>>;
  type Config = ConfigArray[number];

  type Plugin = {
    configs: {
      recommended: Config;
    };
  } & ESLint.Plugin;

  const plugin: Plugin;

  export = plugin;
}

declare module 'eslint-plugin-turbo' {
  import type { ESLint } from 'eslint';
  const plugin: ESLint.Plugin;
  export = plugin;
}
