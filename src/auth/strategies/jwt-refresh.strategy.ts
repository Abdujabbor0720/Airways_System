import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { REDIS } from '../../common/redis/redis.module';
import type { Redis } from 'ioredis';
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(cfg: ConfigService, 
    @Inject(REDIS)
    private readonly redis: Redis) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
            secretOrKey: cfg.get<string>('JWT_REFRESH_SECRET', cfg.get<string>('JWT_SECRET', 'dev-secret')),
        });
    }
    async validate(payload: any) {
        const jti = payload.jti as string;
        const blacklisted = await this.redis.get(`bl:refresh:${jti}`);
        if (blacklisted)
            throw new UnauthorizedException('Token blacklisted');
        return payload;
    }
}
