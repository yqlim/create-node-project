#!/usr/bin/env node
import { init, parseArgs, setupCommands, setupOptions } from './args.js';
import { cliContext, confirmDirectory, rejection } from './logic.js';

const args = await init()
  .then(setupCommands)
  .then(setupOptions)
  .then(parseArgs);

cliContext
  .run(args, async function main() {
    await confirmDirectory().catch(rejection);
  })
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  });
