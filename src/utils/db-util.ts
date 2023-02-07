import mongodb, { MongoClient, MongoClientOptions } from 'mongodb';
import * as redis from 'redis';
import { createClient } from 'redis';
import '../config';
export class DBUtil {
    private static mongoClient: MongoClient;
    private static redisClient; // Todo: Define Type here
    public static async connectToMongo(): Promise<MongoClient> {
        try {
            console.log('MongoUri is this', process.env.MongoUrl);
            if (!DBUtil.mongoClient) {
                console.log('trying to connect mongodb');
                DBUtil.mongoClient = await MongoClient.connect(process.env.MongoUrl);
                console.log('Successfully connected to MongoDB');
            }
            return DBUtil.mongoClient;
        } catch (err) {
            console.log('Error connecting to MongoDB: ', err);
            throw err;
        }
    }

    public static async connectToRedis() {
        if (!DBUtil.redisClient) {
            DBUtil.redisClient = createClient({
                url: process.env.RedisHost,
                password: process.env.RedisPassword,
            });
            DBUtil.redisClient.on('error', (err) => console.log('Redis Client Error', err));

            await DBUtil.redisClient.connect();

            await DBUtil.redisClient.set('password', '12345');
            const value = await DBUtil.redisClient.get('password');
            console.log('redis key val is this', value);

            console.log('Successfully connected to Redis');
        }
        return DBUtil.redisClient;
    }

    public static closeConnections(): void {
        if (DBUtil.mongoClient) {
            DBUtil.mongoClient.close();
            console.log('Closed MongoDB connection');
        }
        if (DBUtil.redisClient) {
            DBUtil.redisClient.quit();
            console.log('Closed Redis connection');
        }
    }
}

// async function test() {
//     console.log('trying to connect mongodb');
//     const mongoDb = await MongoClient.connect("mongodb://localhost:27017/");
//     console.log('Successfully connected to MongoDB');
//     const db = mongoDb.db('examined-health');
//     const apiKeyCollection = db.collection('account');
//     // const key = await apiKeyCollection.findOne({ apiKey: apiKey });
//     const key = await apiKeyCollection.findOne({ apiKey: 'F3U7z9PE16nCSF27Vf8A' });
//     console.log('key', key);
//     mongoDb.close();
//     console.log('Closed MongoDB connection');
// }
// test();
