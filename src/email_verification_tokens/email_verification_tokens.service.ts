import { Injectable, BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MoreThan } from 'typeorm';
import { EmailVerificationToken } from './entities/email_verification_token.entity';
import { randomBytes } from 'crypto';
@Injectable()
export class EmailVerificationTokensService {
    constructor(
    @InjectRepository(EmailVerificationToken)
    private readonly repo: Repository<EmailVerificationToken>, private readonly dataSource: DataSource) { }
    private generateToken(): string {
        return randomBytes(32).toString('hex');
    }
    async issue(user_id: string) {
        return this.dataSource.transaction(async (manager) => {
            await manager.update(EmailVerificationToken, { user_id, used_at: undefined }, { expires_at: new Date(Date.now() - 1000) });
            const active = await manager.findOne(EmailVerificationToken, {
                where: { user_id, used_at: undefined, expires_at: MoreThan(new Date()) },
            });
            if (active)
                throw new ConflictException('Active verification token already exists for this user');
            const token = this.generateToken();
            const expires = new Date(Date.now() + 24 * 3600 * 1000);
            const entity = manager.create(EmailVerificationToken, { user_id, token, expires_at: expires });
            return await manager.save(entity);
        });
    }
    async consume(token: string) {
        return this.dataSource.transaction(async (manager) => {
            const rec = await manager.findOne(EmailVerificationToken, { where: { token } });
            if (!rec)
                throw new BadRequestException('Invalid token');
            if (rec.used_at)
                throw new ForbiddenException('Token already used');
            if (rec.expires_at.getTime() < Date.now())
                throw new BadRequestException('Token expired');
            rec.used_at = new Date();
            await manager.save(rec);
            return { ok: true };
        });
    }
}
