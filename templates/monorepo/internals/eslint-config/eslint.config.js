import { defineConfig } from 'eslint/config';

import { configs } from './dist/shared/base.js';

export default defineConfig(...configs);
