import fs from 'node:fs';

import { AnswerContext } from '../contexts/answers.js';

export async function ensureDirectoryExists(): Promise<void> {
  const directory = AnswerContext.consume().get('directory');
  await fs.promises.mkdir(directory, { recursive: true });
}
