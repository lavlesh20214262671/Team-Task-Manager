// import dotenv from 'dotenv';
// dotenv.config();
// import httpServer from './app';

// import redisClient from "./config/redis";




// const PORT = Number(process.env.PORT) || 5000;

// const start = async () => {
//   try {
//     // Connect to Redis (Optional for MVP, but good for scaling)
//     await redisClient.connect().catch(err => console.warn('Redis not connected, proceeding without it:', err.message));
    
//     httpServer.listen(PORT, '0.0.0.0', () => {
//       console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
//     });
//   } catch (error: any) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };

// start();



import dotenv from 'dotenv';
dotenv.config();

import httpServer from './app';

const PORT = Number(process.env.PORT) || 5000;

const start = async () => {
  try {
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (error: any) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();