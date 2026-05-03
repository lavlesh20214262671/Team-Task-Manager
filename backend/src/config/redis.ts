// import { createClient } from 'redis';

// const redisClient = createClient({
//   url: process.env.REDIS_URL
// });

// redisClient.on('error', (err: any) => {
//   console.log('Redis Error:', err);
// });

// export default redisClient;


const redisClient = {
  connect: async () => {
    console.log('Redis disabled');
  }
};

export default redisClient;