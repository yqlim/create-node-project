import fs from 'node:fs';
import path from 'node:path';

/**
 * This is to cache the resolved TS version so that the prettier extension
 * service will not keep reading the package.json file.
 *
 * @type {string | null}
 */
let currentTypeScriptVersion = null;

/**
 * @returns {typeof currentTypeScriptVersion}
 */
function getCurrentTypeScriptVersion() {
  if (!currentTypeScriptVersion) {
    const pkgTscPath = path.resolve(
      import.meta.dirname,
      'node_modules/typescript/package.json',
    );

    if (fs.existsSync(pkgTscPath)) {
      const pkgTscContent = fs.readFileSync(pkgTscPath, 'utf8');
      /**
       * @type {{ version: string }}
       */
      const pkgTsc = JSON.parse(pkgTscContent); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
      const tscVersion = pkgTsc.version;
      const versionRegex = /^[0-9]+\.[0-9]+\.[0-9]+(?:-.+)?$/;
      if (versionRegex.test(tscVersion)) {
        currentTypeScriptVersion = tscVersion;
      }
    }
  }

  return currentTypeScriptVersion;
}

/**
 * @typedef {Partial<
 *   import('@ianvs/prettier-plugin-sort-imports').PluginConfig &
 *     import('prettier').Config &
 *     import('prettier-plugin-jsdoc').Options &
 *     import('prettier-plugin-sh').ShParserOptions
 * >} PrettierConfig
 *
 * @type {PrettierConfig}
 */
export default {
  singleQuote: true,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-jsdoc',
    'prettier-plugin-sh',
  ],
  // @ianvs/prettier-plugin-sort-imports
  importOrder: [
    '',
    '<BUILTIN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^((@|~|#|\\$)+/)|((~|#|\\$)[^/])',
    '',
    '^[.]',
    '',
    '<TYPES>',
    '<TYPES>^[.]',
    '',
  ],
  importOrderTypeScriptVersion: getCurrentTypeScriptVersion() || undefined, // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
  // prettier-plugin-jsdoc
  jsdocCommentLineStrategy: 'multiline',
  jsdocPreferCodeFences: true,
  tsdoc: true,
  // prettier-plugin-sh
};
