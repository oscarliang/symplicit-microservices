import { registerAs } from '@nestjs/config';

/**
 * Mongo database connection config
 */
export default registerAs('mongodb', () => {
  const MONGO_URI =
    process.env.MONGO_URI ||
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}?authSource=${process.env.MONGO_AUTH_SOURCE}`;
  return {
    uri: `${MONGO_URI}`,
    DEBUG: true,
  };
});
