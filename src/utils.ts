import fs from 'node:fs';
import path from 'node:path';

export class CNPError extends Error {
  override readonly name = 'CreateNodeProjectError';
}

export function fsEntityExists(directory: string): boolean {
  return fs.existsSync(normalisePath(directory));
}

export function isDirectoryNodeProject(directory: string): boolean {
  const dirname = normalisePath(directory);
  const indicatorFile = path.resolve(dirname, 'package.json');
  return fsEntityExists(indicatorFile);
}

export function normalisePath(pathname: string): string {
  return path.isAbsolute(pathname)
    ? pathname
    : path.resolve(process.cwd(), pathname);
}
