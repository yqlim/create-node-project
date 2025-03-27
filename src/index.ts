#!/usr/bin/env node
import { AnswerContext } from './contexts/answers.js';
import { InputsContext } from './contexts/inputs.js';
import { PackageContext } from './contexts/package.js';
import { ensureDirectoryExists } from './logics/ensure-directory.js';
import { CNPError } from './utils/index.js';

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
}
