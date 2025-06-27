import { configs } from '@packages/eslint-config/shared/library.js';
import tsEslint from 'typescript-eslint';

export default tsEslint.config(...configs);
