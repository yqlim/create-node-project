#!/usr/bin/env node
import { argvContext as argv } from './contexts/argv.js';
import { updateArgvWithPrompts } from './logic/prompts/index.js';
import { CNPError } from './utils/index.js';

argv.provide(main).catch((error: unknown) => {
  if (error instanceof Error && error.name === 'ExitPromptError') {
    console.error('\nAborted\n');
  } else {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    process.exitCode ||= 1;
    // Prevent printing the stack trace if the error is a handled error
    console.error('\n%s\n', error instanceof CNPError ? error.message : error);
  }
});

async function main(): Promise<void> {
  await updateArgvWithPrompts();

  console.log(argv.store);
}
