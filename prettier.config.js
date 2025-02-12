// spellchecker:ignore ianvs

import fs from 'node:fs';
import path from 'node:path';

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
  importOrderTypeScriptVersion: getCurrentTypeScriptVersion() || undefined,
  // prettier-plugin-jsdoc
  jsdocCommentLineStrategy: 'multiline',
  jsdocPreferCodeFences: true,
  tsdoc: true,
  // prettier-plugin-sh
};

/**
 * @returns {string | null}
 */
function getCurrentTypeScriptVersion() {
  let ret = null;

  const pkgTscPath = path.resolve(
    import.meta.dirname,
    'node_modules/typescript/package.json',
  );

  if (fs.existsSync(pkgTscPath)) {
    const pkgTscContent = fs.readFileSync(pkgTsc, 'utf8');
    const pkgTsc = JSON.parse(pkgTscContent);
    const tscVersion = pkgTsc.version;
    const versionRegex = /^[0-9]+\.[0-9]+\.[0-9]+(?:-.+)?$/;
    if (versionRegex.test(tscVersion)) {
      ret = tscVersion;
    }
  }

  return ret;
}
