import dotenv from "dotenv";
dotenv.config();

import { createClient } from "redis";

const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    },
});

redisClient.on("error", (err) => {
    console.log("Redis Error:", err.message || err);
});

redisClient.on("connect", () => {
    console.log("Redis Connected");
});

const connectRedis = async () => {
    try {
        if (redisClient.isOpen) {
            return redisClient;
        }

        await redisClient.connect();
        return redisClient;
    } catch (error) {
        console.log("Redis connection failed:", error.message || error);
        return redisClient;
    }
};

connectRedis();

const ensureRedisConnection = async () => {
    try {
        if (!redisClient.isOpen) {
            await connectRedis();
        }

        return redisClient.isOpen;
    } catch (error) {
        console.log("Redis connection failed:", error.message || error);
        return false;
    }
};

export const safeRedisGet = async (key) => {
    try {
        if (!(await ensureRedisConnection())) {
            return null;
        }

        return await redisClient.get(key);
    } catch (error) {
        console.log("Redis get error:", error.message || error);
        return null;
    }
};

export const safeRedisSet = async (key, value) => {
    try {
        if (!(await ensureRedisConnection())) {
            return false;
        }

        await redisClient.set(key, value);

        return true;
    } catch (error) {
        console.log("Redis set error:", error.message || error);
        return false;
    }
};

export const safeRedisDel = async (key) => {
    try {
        if (!(await ensureRedisConnection())) {
            return null;
        }

        return await redisClient.del(key);
    } catch (error) {
        console.log("Redis delete error:", error.message || error);
        return null;
    }
};

export const invalidateRedisPrefix = async (pattern) => {
    try {
        if (!(await ensureRedisConnection())) {
            return [];
        }

        const keys = [];

        for await (const key of redisClient.scanIterator({
            MATCH: pattern,
            COUNT: 100,
        })) {
            keys.push(key);
        }

        if (keys.length > 0) {
            await redisClient.del(keys);
        }

        return keys;
    } catch (error) {
        console.log("Redis prefix invalidation error:", error.message || error);
        return [];
    }
};

export default redisClient;