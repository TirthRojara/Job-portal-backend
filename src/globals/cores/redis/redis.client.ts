import Redis from 'ioredis';
import { log } from '~/globals/helpers/log.helper';

const baseConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
};

// 1. PUB/SUB CLIENTS (Must never fail, just wait)
// 'maxRetriesPerRequest: null' is CRITICAL for Pub/Sub and BullMQ
const pubSubConfig = {
    ...baseConfig,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    // retryStrategy: (times: any) => Math.min(times * 60, 1000), // Keep trying forever
    retryStrategy: () => 1000 * 60 * 10 // for development
};

const redisPublisher = new Redis(pubSubConfig);
const redisSubscriber = new Redis(pubSubConfig);

// 2. CACHE CLIENT (Should fail fast so we can fallback to DB)
const cacheConfig = {
    ...baseConfig,
    maxRetriesPerRequest: 1, // Fail request immediately if Redis is down
    enableOfflineQueue: false, // ✅ CRITICAL FIX: Don't stack commands if down
    // retryStrategy: (times: any) => Math.min(times * 60, 1000), // Reconnect in background
    retryStrategy: () => 1000 * 60 * 10 // for development
};

const _redisClient = new Redis(cacheConfig);

// 👇 GLOBAL ERROR HANDLER INTERCEPTOR VIA PROXY 👇
const redisClient = new Proxy(_redisClient, {
    get(target, prop: string | symbol) {
        const value = Reflect.get(target, prop);

        // If accessing a function (like .get, .set, .sadd), wrap it
        if (typeof value === 'function') {
            return async (...args: any[]) => {
                try {
                    // Call the original Redis method
                    return await value.apply(target, args);
                } catch (error: any) {
                    // Swallow the "Stream isn't writable" error
                    log.warn(`Redis error on command "${String(prop)}": ${error.message}`);
                    return null; // Return null to fallback to DB
                }
            };
        }

        return value;
    }
});


[redisPublisher, redisSubscriber, _redisClient].forEach((client, i) => {
    client.on('error', (err) => {
        console.error(`Redis client ${i} error:`, err.message);
        // Graceful fallback: e.g., skip cache, use DB
    });
});

export { redisPublisher, redisSubscriber, redisClient };

//==================================================================

// async function  testRedis() {
//     await redisClient.set('testKey', 'testValue')
//     const test = await redisClient.get('testKey')
//     console.log({test})
//     await redisClient.disconnect()
// }

// testRedis()
