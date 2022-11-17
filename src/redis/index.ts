import { createClient } from '@node-redis/client';

export class Redis {
    
    private client;

    constructor() {
        this.client = createClient({url: process.env.REDIS_URL});
        this.client.on('error', (err) => console.log('Redis Client Error', err));
    }

    async connect() {
        const result = await this.client.connect();
        console.log('connection successful')
        console.log(result)
    }

}