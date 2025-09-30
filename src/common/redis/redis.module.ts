import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
export const REDIS = Symbol('REDIS');
@Global()
@Module({
    providers: [
        {
            provide: REDIS,
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => {
                const url = cfg.get<string>('REDIS_URL');
                const host = cfg.get<string>('REDIS_HOST', '127.0.0.1') ?? '127.0.0.1';
                const port = Number(cfg.get('REDIS_PORT', 6379));
                const password = cfg.get<string>('REDIS_PASSWORD') ?? undefined;
                const db = Number(cfg.get('REDIS_DB', 0));
                let redis: Redis;
                try {
                    if (url) {
                        redis = new Redis(url, { db, password });
                    }
                    else {
                        redis = new Redis({ host, port, db, password });
                    }
                }
                catch (err) {
                    throw new Error('Redis ulanishda xatolik: ' + (err?.message ?? err));
                }
                redis.on('error', (err) => {
                });
                redis.on('connect', () => {
                });
                return redis;
            },
        },
    ],
    exports: [REDIS],
})
export class RedisModule {
}
