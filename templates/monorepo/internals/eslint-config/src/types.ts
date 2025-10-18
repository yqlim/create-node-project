import type { defineConfig } from 'eslint/config';

export type { Config } from 'eslint/config';
export type ConfigWithExtends = Parameters<typeof defineConfig>[0];
