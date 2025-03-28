#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

import { AnswerContext } from './contexts/answers.js';
import { InputsContext } from './contexts/inputs.js';
import { PackageContext } from './contexts/package.js';
import { ensureDirectoryExists } from './logics/ensure-directory.js';
import { CNPError, copyDirectory } from './utils/index.js';
import { createTemplate, getTemplatePath } from './utils/templating.js';

try {
  await InputsContext.provide(() => {
    return AnswerContext.provide(() => {
      return PackageContext.provide(main);
    });
  });
} catch (error) {
  process.exitCode ??= 1;
  // Prevent printing the stack trace if the error is a handled error
  console.error('\n%s\n', error instanceof CNPError ? error.message : error);
}

async function main(): Promise<void> {
  console.table(InputsContext.consume().store);
  console.table(AnswerContext.consume().store);
  console.table(PackageContext.consume().store);

  await ensureDirectoryExists();

  const targetOutput = AnswerContext.consume().get('directory');
  const targetTemplate = AnswerContext.consume().get('template');

  await copyDirectory(getTemplatePath(targetTemplate), targetOutput);

  const templatePackageJson = path.join(targetOutput, 'package.json');
  const content = await fs.promises.readFile(templatePackageJson, 'utf-8');
  const substitute = createTemplate(content);
  const substituted = substitute(AnswerContext.consume().store);

  await fs.promises.writeFile(templatePackageJson, substituted);
}
