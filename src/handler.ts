import './config/module-alias';
import Sharp from 'sharp';
import AWS from 'aws-sdk';

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { response } from './helpers/response';

const S3 = new AWS.S3({ signatureVersion: 'v4' });
const pattern = /(.*\/)?(.*)\/(.*)/;

const { BUCKET, URL } = process.env;
const WHITELIST = process.env.WHITELIST
  ? Object.freeze(process.env.WHITELIST.split('|'))
  : null;

const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const path = event.queryStringParameters.path;
    const parts = pattern.exec(path);
    const dir = parts[1] || '';
    const resizeOption = parts[2]; // ? e.g. "150x150"
    const filename = parts[3];

    if (WHITELIST && !WHITELIST.includes(resizeOption)) {
      return response({
        statusCode: 400,
        body: `WHITELIST is set but does not contain the size parameter "${resizeOption}"`,
      });
    }

    const data = await S3.getObject({
      Bucket: BUCKET,
      Key: dir + filename,
    }).promise();

    const sizes = resizeOption.split('x');
    const width = parseInt(sizes[0]);
    const height = parseInt(sizes[1]);

    const result = await Sharp(data.Body as Buffer, { failOnError: false })
      .resize(width, height, { withoutEnlargement: true, fit: 'cover' })
      .rotate()
      .toBuffer();

    await S3.putObject({
      Body: result,
      Bucket: BUCKET,
      ContentType: data.ContentType,
      Key: path,
      CacheControl: 'public, max-age=86400',
    }).promise();

    return response({
      statusCode: 301,
      headers: { Location: `${URL}/${path}` },
    });
  } catch (e) {
    return response({
      statusCode: e.statusCode || 500,
      body: `Exception: ${e.message}`,
    });
  }
};

export { handler };
