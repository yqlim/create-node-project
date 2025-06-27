import tsEslint from 'typescript-eslint';

import { configs } from './dist/shared/base.js';

export default tsEslint.config(...configs);
