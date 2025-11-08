import { config as serverConfig } from '@internals/eslint-config/configs/server.js';
import { configs } from '@internals/eslint-config/shared/base.js';
import { defineConfig } from 'eslint/config';

export default defineConfig(...configs, serverConfig);
