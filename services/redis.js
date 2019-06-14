// connect to Redis
const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  enable_offline_queue: false,
});


  module.exports = redisClient;
  