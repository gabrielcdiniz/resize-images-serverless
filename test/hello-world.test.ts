import LambdaTester from 'lambda-tester';
import { HelloWorldHandler } from '@src/handler';

describe('Helo  World', () => {
  it('GET /hello-world', async () => {
    return LambdaTester(HelloWorldHandler)
      .event({})
      .expectResult((result: any) => {
        const body = JSON.parse(result.body);
        expect(body).toEqual({
          hello: 'world',
        });
        expect(result.statusCode).toBe(200);
      });
  });
});
