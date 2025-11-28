import Redis from "ioredis";

const redisClient = new Redis()

export default redisClient;
 
// async function  testRedis() {
//     await client.set('testKey', 'testValue')
//     const test = await client.get('testKey')
//     console.log({test})
//     await client.disconnect()
// }

// testRedis() 