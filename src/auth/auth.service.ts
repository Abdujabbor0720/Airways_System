import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { EmailVerificationTokensService } from '../email_verification_tokens/email_verification_tokens.service';
import { PasswordResetTokensService } from '../password_reset_tokens/password_reset_tokens.service';
import { AuthLoginsService } from '../auth_logins/auth_logins.service';
import { REDIS } from '../common/redis/redis.module';
import { Inject } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { MailService } from '../common/mail/mail.service';
type Tokens = {
    access_token: string;
    refresh_token: string;
};
@Injectable()
export class AuthService {
    private readonly accessTtl: string;
    private readonly refreshTtl: string;
    constructor(private readonly jwt: JwtService, private readonly cfg: ConfigService, private readonly users: UsersService, private readonly evTokens: EmailVerificationTokensService, private readonly prTokens: PasswordResetTokensService, private readonly authLogins: AuthLoginsService, private readonly mail: MailService, 
    @Inject(REDIS)
    private readonly redis: Redis) {
        this.accessTtl = cfg.get<string>('JWT_ACCESS_TTL', '15m');
        this.refreshTtl = cfg.get<string>('JWT_REFRESH_TTL', '7d');
    }
    async register(dto: RegisterDto) {
        const existing = await this.users.findByEmailLower(dto.email);
        if (existing)
            throw new BadRequestException('Email already in use');
        const password_hash = await hash(dto.password, 12);
        const user = await this.users.createInternal({
            email: dto.email.toLowerCase(),
            password_hash,
            full_name: dto.full_name,
            phone: dto.phone,
            birth_date: dto.birth_date,
            loyalty_opt_in: dto.loyalty_opt_in ?? true,
        });
        const token = await this.evTokens.issue(user.id);
        const link = this.mail.emailVerifyLink(token.token);
        await this.mail.send(user.email, 'Confirm your email', `
          <p>Hi ${user.full_name || ''},</p>
          <p>Please confirm your email by clicking the link below:</p>
          <p><a href="${link}">Verify Email</a></p>
          <p>This link expires at: ${token.expires_at.toISOString()}</p>
        `);
        return { user, email_verification_token: token.token, email_verification_expires_at: token.expires_at };
    }
    async login(dto: LoginDto, ip: string, ua: string): Promise<Tokens> {
        const user = await this.users.findByEmailLower(dto.email);
        const ok = !!user && (await compare(dto.password, user.password_hash));
        await this.authLogins.logUserAttempt(user?.id ?? null, ok, ip, ua);
        if (!ok || !user)
            throw new UnauthorizedException('Invalid credentials');
        const tokens = await this.issueTokens(user.id, user.email);
        return tokens;
    }
    async refresh(refreshToken: string): Promise<Tokens> {
        const payload = await this.verifyRefresh(refreshToken);
        const jti = payload.jti as string;
        const blacklisted = await this.redis.get(this.blKey('refresh', jti));
        if (blacklisted)
            throw new UnauthorizedException('Token reused');
        await this.redis.set(this.blKey('refresh', jti), '1', 'EX', this.secondsFromTtl(this.refreshTtl));
        return this.issueTokens(String(payload.sub), String(payload.email));
    }
    async verifyEmail(token: string) {
        return this.evTokens.consume(token);
    }
    async passwordResetRequest(email: string) {
        const user = await this.users.findByEmailLower(email);
        if (!user)
            return { ok: true };
        await this.throttle(`pwreset:req:${user.id}`, 5, 3600);
        const token = await this.prTokens.issue(user.id);
        const link = this.mail.passwordResetLink(token.token);
        await this.mail.send(user.email, 'Password reset', `
          <p>Hi ${user.full_name || ''},</p>
          <p>We received a request to reset your password.</p>
          <p>Use the link below to set a new password:</p>
          <p><a href="${link}">Reset Password</a></p>
          <p>This link expires at: ${token.expires_at.toISOString()}</p>
        `);
        return { ok: true, token: token.token, expires_at: token.expires_at };
    }
    async passwordResetConfirm(token: string, newPassword: string) {
        const record = await this.prTokens.consume(token);
        if (!record)
            throw new BadRequestException('Invalid token');
        const password_hash = await hash(newPassword, 12);
        await this.users.updatePassword(record.user_id, password_hash);
        return { ok: true };
    }
    private async issueTokens(userId: string, email: string): Promise<Tokens> {
        const accessJti = uuidv4();
        const refreshJti = uuidv4();
        const access = await this.jwt.signAsync({ sub: userId, email, typ: 'access', jti: accessJti }, {
            secret: this.cfg.get<string>('JWT_SECRET', 'dev-secret'),
            expiresIn: this.accessTtl,
        });
        const refresh = await this.jwt.signAsync({ sub: userId, email, typ: 'refresh', jti: refreshJti }, {
            secret: this.cfg.get<string>('JWT_REFRESH_SECRET', this.cfg.get<string>('JWT_SECRET', 'dev-secret')),
            expiresIn: this.refreshTtl,
        });
        await this.redis.set(this.sessionKey(userId, refreshJti), '1', 'EX', this.secondsFromTtl(this.refreshTtl));
        return { access_token: access, refresh_token: refresh };
    }
    private async verifyRefresh(token: string) {
        try {
            return await this.jwt.verifyAsync(token, {
                secret: this.cfg.get<string>('JWT_REFRESH_SECRET', this.cfg.get<string>('JWT_SECRET', 'dev-secret')),
            });
        }
        catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
    private blKey(kind: 'access' | 'refresh', jti: string) {
        return `bl:${kind}:${jti}`;
    }
    private sessionKey(userId: string, jti: string) {
        return `sess:user:${userId}:${jti}`;
    }
    private secondsFromTtl(ttl: string): number {
        const m = ttl.match(/^(\d+)([smhd])$/);
        if (!m)
            return 3600;
        const n = Number(m[1]);
        switch (m[2]) {
            case 's': return n;
            case 'm': return n * 60;
            case 'h': return n * 3600;
            case 'd': return n * 86400;
            default: return 3600;
        }
    }
    private async throttle(key: string, limit: number, windowSec: number) {
        const now = Date.now();
        const k = `throttle:${key}`;
        const cnt = await this.redis.incr(k);
        if (cnt === 1)
            await this.redis.pexpire(k, windowSec * 1000);
        if (cnt > limit)
            throw new BadRequestException('Too many requests');
    }
}
