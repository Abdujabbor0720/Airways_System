import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AdminUsersService } from '../admin_users/admin_users.service';
import { AuthLoginsService } from '../auth_logins/auth_logins.service';
import { Inject } from '@nestjs/common';
import { REDIS } from '../common/redis/redis.module';
import type { Redis } from 'ioredis';
type Tokens = {
    access_token: string;
    refresh_token: string;
};
@Injectable()
export class AdminAuthService {
    private readonly accessTtl: string;
    private readonly refreshTtl: string;
    constructor(private readonly jwt: JwtService, private readonly cfg: ConfigService, private readonly admins: AdminUsersService, private readonly authLogins: AuthLoginsService, 
    @Inject(REDIS)
    private readonly redis: Redis) {
        this.accessTtl = cfg.get<string>('JWT_ACCESS_TTL', '15m');
        this.refreshTtl = cfg.get<string>('JWT_REFRESH_TTL', '7d');
    }
    async login(email: string, password: string, ip?: string, ua?: string): Promise<Tokens> {
        const admin = await this.admins.findByEmailLower(email);
        const ok = !!admin && (await compare(password, admin.password_hash));
        await this.authLogins.logAdminAttempt(admin?.id ?? null, ok, ip, ua);
        if (!ok || !admin)
            throw new UnauthorizedException('Invalid credentials');
        return this.issueTokens(admin.id, email.toLowerCase(), admin.role);
    }
    private async issueTokens(adminId: string, email: string, role: 'ADMIN' | 'SUPER_ADMIN'): Promise<Tokens> {
        const accessJti = uuidv4();
        const refreshJti = uuidv4();
        const secret = this.cfg.get<string>('JWT_SECRET', 'dev-secret');
        const refreshSecret = this.cfg.get<string>('JWT_REFRESH_SECRET', secret);
        const access = await this.jwt.signAsync({ sub: adminId, email, role, typ: 'access', jti: accessJti }, {
            secret,
            expiresIn: this.accessTtl,
        });
        const refresh = await this.jwt.signAsync({ sub: adminId, email, role, typ: 'refresh', jti: refreshJti }, {
            secret: refreshSecret,
            expiresIn: this.refreshTtl,
        });
        await this.redis.set(`sess:admin:${adminId}:${refreshJti}`, '1', 'EX', this.secondsFromTtl(this.refreshTtl));
        return { access_token: access, refresh_token: refresh };
    }
    private secondsFromTtl(ttl: string) {
        const m = ttl.match(/^(\d+)([smhd])$/);
        if (!m)
            return 3600;
        const n = Number(m[1]);
        return m[2] === 's' ? n : m[2] === 'm' ? n * 60 : m[2] === 'h' ? n * 3600 : n * 86400;
    }
}
