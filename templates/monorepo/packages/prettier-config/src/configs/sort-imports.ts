import fs from 'node:fs';
import path from 'node:path';

import type { PluginConfig } from '@ianvs/prettier-plugin-sort-imports';
import type { Config } from 'prettier';

let currentTypeScriptVersion: string | null = null;

function getCurrentTypeScriptVersion(): typeof currentTypeScriptVersion {
  if (!currentTypeScriptVersion) {
    const pkgTscPath = path.resolve(
      process.cwd(),
      'node_modules/typescript/package.json',
    );

    if (fs.existsSync(pkgTscPath)) {
      const pkgTscContent = fs.readFileSync(pkgTscPath, 'utf8');
      const pkgTsc = JSON.parse(pkgTscContent) as {
        version: string;
        [key: string]: unknown;
      };
      const tscVersion = pkgTsc.version;
      const versionRegex = /^[0-9]+\.[0-9]+\.[0-9]+(?:-.+)?$/;
      if (versionRegex.test(tscVersion)) {
        currentTypeScriptVersion = tscVersion;
      }
    }
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
