const { MONGO_URL } = process.env;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export { headers, MONGO_URL };
