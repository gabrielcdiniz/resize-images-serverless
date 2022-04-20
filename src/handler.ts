import './config/module-alias';
import { headers } from '@src/config/constants';

export const handler = async (_event: any, _context: any) => {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      hello: 'world',
    }),
  };
};
