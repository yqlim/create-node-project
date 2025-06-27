import fs from 'node:fs';
import path from 'node:path';

/**
 * @type {string | null}
 */
let currentTypeScriptVersion = null;

/**
 * @type {import('prettier').Config}
 */
export default {
  singleQuote: true,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-jsdoc',
    'prettier-plugin-pkg',
  ],
  // prettier-plugin-jsdoc
  jsdocCommentLineStrategy: 'multiline',
  jsdocPreferCodeFences: true,
  tsdoc: true,
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
  importOrderTypeScriptVersion: getCurrentTypeScriptVersion() ?? '5.0.0',
};

/**
 * @returns {string | null} The current TypeScript version or null if not found.
 */
function getCurrentTypeScriptVersion() {
  if (!currentTypeScriptVersion) {
    const versionRegex =
      /^(?:[\^~><])?(?<version>[0-9]+\.[0-9]+\.[0-9]+(?:-.+)?)$/;

    /**
     * @param {unknown} str
     * @returns {string | null}
     */
    const parseVersion = (str) =>
      versionRegex.exec(typeof str === 'string' ? str : '')?.groups?.[
        'version'
      ] ?? null;

    /**
     * @param {...string} pathChunks
     * @returns {string | null}
     */
    const getVersionFromPackageJson = (...pathChunks) => {
      const filePath = path.resolve(...pathChunks);

      try {
        if (!fs.existsSync(filePath)) {
          throw new Error(`File does not exist`);
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        /**
         * @type {unknown}
         */
        const pkgJson = JSON.parse(content);

        if (
          !pkgJson ||
          typeof pkgJson !== 'object' ||
          !('version' in pkgJson) ||
          typeof pkgJson.version !== 'string'
        ) {
          throw new Error(`Invalid package.json format`);
        }

        return parseVersion(pkgJson.version);
      } catch (error) {
        console.error(`Error reading package.json at ${filePath}:`, error);
        return null;
      }
    };

    currentTypeScriptVersion =
      getVersionFromPackageJson(
        import.meta.dirname,
        'node_modules/typescript/package.json',
      ) ??
      getVersionFromPackageJson(import.meta.dirname, 'package.json') ??
      null;
  }

  return currentTypeScriptVersion;
}
