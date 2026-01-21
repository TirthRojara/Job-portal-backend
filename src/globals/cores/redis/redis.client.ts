import Redis from 'ioredis';

// const redisClient = new Redis()

// export default redisClient;

// const config = {
//     host: process.env.REDIS_HOST || 'localhost',
//     port: parseInt(process.env.REDIS_PORT || '6379'),
//     maxRetriesPerRequest: 1, // Fail fast! Don't wait long if Redis is down
//     lazyConnect: true, // ✅ Key Fix: Don't crash app on startup
//     retryStrategy: (times: any) => {
//         // ✅ Key Fix: Retry forever in background, but don't crash
//         // Wait 2s between retries, capping at 30s
//         const delay = Math.min(times * 50, 2000);
//         return delay;
//     }
// };

// // Eager publisher (immediate connect)
// const redisPublisher = new Redis(config);

// // Lazy subscriber (connects on first subscribe())
// // const redisSubscriber = new Redis({ ...config, lazyConnect: true });
// const redisSubscriber = new Redis(config);

// // Eager cache client
// const redisClient = new Redis(config);







const baseConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
};


// 1. PUB/SUB CLIENTS (Must never fail, just wait)
// 'maxRetriesPerRequest: null' is CRITICAL for Pub/Sub and BullMQ
const pubSubConfig = {
    ...baseConfig,
    maxRetriesPerRequest: null, 
    enableReadyCheck: false,
    // retryStrategy: (times: any) => Math.min(times * 60, 1000), // Keep trying forever
    retryStrategy: () => 1000 * 60 * 10, // for development
};

 const redisPublisher = new Redis(pubSubConfig);
 const redisSubscriber = new Redis(pubSubConfig);

// 2. CACHE CLIENT (Should fail fast so we can fallback to DB)
const cacheConfig = {
    ...baseConfig,
    maxRetriesPerRequest: 1,  // Fail request immediately if Redis is down
    enableOfflineQueue: false, // ✅ CRITICAL FIX: Don't stack commands if down
    // retryStrategy: (times: any) => Math.min(times * 60, 1000), // Reconnect in background
    retryStrategy: () => 1000 * 60 * 10, // for development
};

 const redisClient = new Redis(cacheConfig);















// Add error handlers to prevent crashes
[redisPublisher, redisSubscriber, redisClient].forEach((client, i) => {
    client.on('error', (err) => {
        console.error(`Redis client ${i} error:`, err.message);
        // Graceful fallback: e.g., skip cache, use DB
    });
});

export { redisPublisher, redisSubscriber, redisClient };

// async function  testRedis() {
//     await redisClient.set('testKey', 'testValue')
//     const test = await redisClient.get('testKey')
//     console.log({test})
//     await redisClient.disconnect()
// }

// testRedis()
