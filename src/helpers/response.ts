import type { APIGatewayProxyResult } from 'aws-lambda';

import { headers as defaultHeaders } from '@src/config/constants';

const defaultResult: APIGatewayProxyResult = {
  statusCode: 200,
  body: null,
};

const response = (
  partialResult: Partial<APIGatewayProxyResult>,
): APIGatewayProxyResult => {
  const { headers } = partialResult;

  return {
    ...defaultResult,
    ...partialResult,
    headers: { ...defaultHeaders, ...headers },
  };
};

export { response };
