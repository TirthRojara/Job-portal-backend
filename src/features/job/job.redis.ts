import { RedisKey } from "~/globals/constants/redis.constant";
import { redisClient } from "~/globals/cores/redis/redis.client";

class JobRedis {

    // ✅
    // GET/:companyid
    // => check sismember in VIEWS_SET     - ttl = 24H , use 'NX' 
    //      => yes => do nothing
    //      => no => sAdd => in VIEWS_SET => data: userId and => incr VIEWS_COUNT

    // ✅
    // => 15 min CRON JOB
    // => Redis VIEWS_COUNT store in db
    // => del VIEWS_COUNT

    // ✅
    // GET /company/{id}/views:
    // redis => get VIEWS_COUNT
    // db => views
    // return db views + redis views

    public async INCR_views(userId: number, jobId: number){

        const added = await redisClient.sadd(RedisKey.JOB.VIEWS_SET(jobId), userId)

        // set TTL only if the key has no expiry yet (e.g. first time)
        await redisClient.expire(RedisKey.JOB.VIEWS_SET(jobId), 86400, 'NX'); // 24 H

        if (added == 1) {
            redisClient.incr(RedisKey.JOB.VIEWS_COUNT(jobId))
        }

    }

}

export const jobRedis: JobRedis = new JobRedis();
