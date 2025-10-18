import fs from 'node:fs';
import path from 'node:path';

import type { PluginConfig } from '@ianvs/prettier-plugin-sort-imports';
import type { Config } from 'prettier';

let currentTypeScriptVersion: string | null = null;

function getCurrentTypeScriptVersion(): typeof currentTypeScriptVersion {
  if (!currentTypeScriptVersion) {
    const versionRegex =
      /^(?:[\^~><])?(?<version>[0-9]+\.[0-9]+\.[0-9]+(?:-.+)?)$/;

    const parseVersion = (str: unknown): string | null =>
      versionRegex.exec(typeof str === 'string' ? str : '')?.groups?.[
        'version'
      ] ?? null;

    const getVersionFromPackageJson = (
      ...pathChunks: string[]
    ): string | null => {
      const filePath = path.resolve(...pathChunks);

      try {
        if (!fs.existsSync(filePath)) {
          throw new Error(`File does not exist`);
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const pkgJson = JSON.parse(content) as unknown;

        if (
          !pkgJson ||
          typeof pkgJson !== 'object' ||
          !('version' in pkgJson) ||
          typeof pkgJson.version !== 'string'
        ) {
          throw new Error(`Invalid package.json format`);
        }

        return parseVersion(pkgJson.version);
      } catch (_) {
        return null;
      }
    };

    currentTypeScriptVersion =
      getVersionFromPackageJson(
        process.cwd(),
        'node_modules/typescript/package.json',
      ) ??
      getVersionFromPackageJson(process.cwd(), 'package.json') ??
      null;
  }

  return currentTypeScriptVersion;
}

export const config: Config & PluginConfig = {
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
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

export default config;
