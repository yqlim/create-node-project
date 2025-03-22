import fs from 'node:fs';
import path from 'node:path';

import { AnswerContext } from '../contexts/answers.js';
import { runCommand } from '../utils/index.js';

export async function setupGit(): Promise<void> {
  await runCommand('git', ['init']);
  await fs.promises.writeFile(
    path.join(AnswerContext.consume().get('directory'), '.gitignore'),
    ['.DS_Store', '.env', 'dist', 'node_modules', 'out']
      .sort((a, b) => a.localeCompare(b))
      .join('\n'),
  );
}
