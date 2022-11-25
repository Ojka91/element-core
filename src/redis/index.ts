import { logger } from '@/utils/logger';
import { createClient } from '@node-redis/client';

/**
 * Redis is an in-memory data structure store
 * We use it to store, retreive and update live game statuses
 * We only keep data in memory for 1 day
 */
class Redis {
    
    private client;

    constructor() {
        this.client = createClient({url: process.env.REDIS_URL});
        this.client.on('error', (err) => logger.error(err, 'Error connecting with redis'));
    }

    async connect() {
        try {
            await this.client.connect();
            logger.info('Redis connected successfuly')
            
        } catch (error) {
            logger.error(error, 'Failed connecting to redis')
        }
    }

    /**
     * Store game data into redis cache
     * By default game will be expired (deleted) after one day (86400 seconds) from redis
     * @param id game room/id
     * @param data game data
     */
    async set(id: string, data: any): Promise<any> { // TODO data type to define?
        try {
            return await this.client.setEx(id, 86400, data);
        } catch (error) {
            logger.error(error, `Failed storing to redis game id: ${id}`)
        }
    }

    /**
     * Retreive game data from redis
     * @param id game room/id
     */
    async get(id: string): Promise<any> {  // TODO define data type?
        try {
            const data: any = await this.client.get(id);
            return JSON.parse(data);
        } catch (error) {
            logger.error(error, `Failed retreiving data from redis game id: ${id}`)
        }
    }

}

export class RedisSingleton {

    static redis: Redis;

    constructor() {
        throw new Error('Use RedisSingleton.getInstance()');
    }
    static getInstance() {
        if (!RedisSingleton.redis) {
            RedisSingleton.redis = new Redis();
        }
        return RedisSingleton.redis;
    }
}