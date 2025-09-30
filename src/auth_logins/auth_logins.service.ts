import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AuthLogin } from './entities/auth_login.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthLoginsService {
    private redis: Redis;
    constructor(
    @InjectRepository(AuthLogin)
    private readonly repo: Repository<AuthLogin>, private readonly dataSource: DataSource, private readonly jwtService: JwtService, private readonly configService: ConfigService) {
        const redisUrl = this.configService.get<string>('REDIS_URL');
        const host = this.configService.get<string>('REDIS_HOST', '127.0.0.1');
        const port = this.configService.get<number>('REDIS_PORT', 6379);
        const password = this.configService.get<string>('REDIS_PASSWORD');
        const db = this.configService.get<number>('REDIS_DB', 0);
        if (redisUrl) {
            this.redis = new Redis(redisUrl, { db, password });
        }
        else {
            this.redis = new Redis({ host, port, db, password });
        }
    }
    async login(email: string, password: string, ip?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const payload = { sub: 'userId', role: 'USER' };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        await this.redis.set(`refresh:${payload.sub}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
        await this.logUserAttempt('userId', true, ip, userAgent);
        return { accessToken, refreshToken };
    }
    async refresh(userId: string, oldRefreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const stored = await this.redis.get(`refresh:${userId}`);
        if (!stored || stored !== oldRefreshToken)
            throw new UnauthorizedException('Invalid refresh token');
        const payload = { sub: userId, role: 'USER' };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        await this.redis.set(`refresh:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
        return { accessToken, refreshToken };
    }
    async logout(userId: string): Promise<{
        success: boolean;
    }> {
        await this.redis.del(`refresh:${userId}`);
        return { success: true };
    }
    async register(email: string, password: string): Promise<{
        success: boolean;
    }> {
        const password_hash = await bcrypt.hash(password, 12);
        return { success: true };
    }
    async verifyEmail(token: string): Promise<{
        success: boolean;
    }> {
        return { success: true };
    }
    async requestPasswordReset(email: string): Promise<{
        success: boolean;
    }> {
        return { success: true };
    }
    async resetPassword(token: string, newPassword: string): Promise<{
        success: boolean;
    }> {
        return { success: true };
    }
    async logUserAttempt(userId: string | null, success: boolean, ip?: string, userAgent?: string): Promise<AuthLogin> {
        if (userId && isNaN(Number(userId)))
            throw new BadRequestException('Invalid userId');
        if (ip && typeof ip !== 'string')
            throw new BadRequestException('Invalid IP address');
        if (userAgent && typeof userAgent !== 'string')
            throw new BadRequestException('Invalid user agent');
        const entity: Partial<AuthLogin> = {
            user_id: userId ?? null,
            admin_user_id: null,
            success,
            ip: ip ?? null,
            user_agent: userAgent ?? null,
        };
        return await this.dataSource.transaction(async (manager) => {
            const log = manager.create(AuthLogin, entity);
            return await manager.save(AuthLogin, log);
        });
    }
    async logAdminAttempt(adminUserId: string | null, success: boolean, ip?: string, userAgent?: string): Promise<AuthLogin> {
        if (adminUserId && isNaN(Number(adminUserId)))
            throw new BadRequestException('Invalid adminUserId');
        if (ip && typeof ip !== 'string')
            throw new BadRequestException('Invalid IP address');
        if (userAgent && typeof userAgent !== 'string')
            throw new BadRequestException('Invalid user agent');
        const entity: Partial<AuthLogin> = {
            user_id: null,
            admin_user_id: adminUserId ?? null,
            success,
            ip: ip ?? null,
            user_agent: userAgent ?? null,
        };
        return await this.dataSource.transaction(async (manager) => {
            const log = manager.create(AuthLogin, entity);
            return await manager.save(AuthLogin, log);
        });
    }
}
