import Redis from 'ioredis';

// const redisClient = new Redis()

// export default redisClient;

const config = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: 3
};

// Eager publisher (immediate connect)
const redisPublisher = new Redis(config);

// Lazy subscriber (connects on first subscribe())
const redisSubscriber = new Redis({ ...config, lazyConnect: true });

// Eager cache client
const redisClient = new Redis(config);

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
