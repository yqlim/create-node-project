#!/usr/bin/env node
import { AnswerContext } from './contexts/answers.js';
import { InputsContext } from './contexts/inputs.js';
import { CNPError } from './utils/index.js';

try {
  await InputsContext.provide(() => AnswerContext.provide(main));
} catch (error) {
  process.exitCode ??= 1;
  // Prevent printing the stack trace if the error is a handled error
  console.error('\n%s\n', error instanceof CNPError ? error.message : error);
}

function main(): void {
  console.table(InputsContext.consume().store);
  console.table(AnswerContext.consume().store);
}
