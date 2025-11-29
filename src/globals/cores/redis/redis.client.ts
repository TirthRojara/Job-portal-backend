import Redis from 'ioredis';

// const redisClient = new Redis()

// export default redisClient;

const redisPublisher = new Redis();
const redisSubscriber = new Redis();

const redisClient = new Redis();

export { redisPublisher, redisSubscriber, redisClient };

// async function  testRedis() {
//     await client.set('testKey', 'testValue')
//     const test = await client.get('testKey')
//     console.log({test})
//     await client.disconnect()
// }

// testRedis()
