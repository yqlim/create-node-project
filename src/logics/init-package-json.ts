import fs from 'node:fs';
import path from 'node:path';

import AnswerContext from '../contexts/answers.js';

import type { PackageJson } from 'type-fest';
import type { AnswerStore } from '../contexts/answers.js';

export async function initPackageJson() {
  const answers = AnswerContext.consume();
  const pkg: PackageJson = {
    name: answers.get('name'),
    version: answers.get('version'),
    description: answers.get('description'),
    private: answers.get('publish') === 'private',
    type: answers.get('type'),
    license: inferLicense(answers.get('publish'), answers.get('license')),
  };

  if (answers.get('publish') === 'public') {
    delete pkg.private;
  }

  await fs.promises.writeFile(
    path.join(answers.get('directory'), 'package.json'),
    JSON.stringify(pkg, null, 2),
  );
}

function inferLicense(
  visibility: AnswerStore['publish'],
  licenses: AnswerStore['license'],
): string {
  switch (licenses.length) {
    case 0:
      return visibility === 'private' ? 'UNLICENSED' : 'MIT';
    case 1:
      return licenses[0] ?? 'MIT';
    default:
      return `(${licenses.join(' OR ')})`;
  }
}
