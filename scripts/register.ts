import { register } from 'tsconfig-paths';
import { resolve } from 'path';

const baseUrl = resolve(__dirname, '../');
const { absoluteBaseUrl, paths } = require('./tsconfig.json').compilerOptions;

register({
  baseUrl,
  paths: {
    '@/*': ['src/*'],
  },
});
