import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    clearMocks: true,
    dir: 'src',
    passWithNoTests: true,
    watch: false,
  },
});
