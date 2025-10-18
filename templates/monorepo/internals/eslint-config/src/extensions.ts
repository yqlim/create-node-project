import path from 'node:path';

export const md = ['md'] as const satisfies string[];
export const mdx = ['mdx'] as const satisfies string[];

export const js = ['js', 'cjs', 'mjs'] as const satisfies string[];
export const ts = ['ts', 'cts', 'mts'] as const satisfies string[];
export const jsx = ['jsx'] as const satisfies string[];
export const tsx = ['tsx'] as const satisfies string[];

export const all = [
  ...js,
  ...ts,
  ...jsx,
  ...tsx,
  ...md,
  ...mdx,
] as const satisfies string[];

export function withExt(
  names: string[],
  exts: [string, ...string[]],
): string[] {
  return dedupe(names.flatMap((name) => exts.map((ext) => `${name}.${ext}`)));
}

export function withDir(dirs: string[], names: string[]): string[] {
  return dedupe(
    dirs.flatMap((dir) => names.map((name) => path.join(dir, name))),
  );
}

function dedupe<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}
