import { join, resolve } from 'path';
import moduleAlias from 'module-alias';

const root = resolve(__dirname, '../..');

moduleAlias.addAliases({
  '@src': join(root, 'src'),
  '@test': join(root, 'test'),
  '@types': join(root, 'types'),
});
