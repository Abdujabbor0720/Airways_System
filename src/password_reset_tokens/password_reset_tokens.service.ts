import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { PasswordResetToken } from './entities/password_reset_token.entity';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class PasswordResetTokensService {
    constructor(
    @InjectRepository(PasswordResetToken)
    private readonly repo: Repository<PasswordResetToken>) { }
    async issue(user_id: string) {
        const active = await this.repo.findOne({ where: { user_id, used_at: IsNull() } });
        if (active && active.expires_at.getTime() > Date.now()) {
            throw new ConflictException('Foydalanuvchi uchun aktiv reset token allaqachon mavjud');
        }
        const token = uuidv4() + '-' + Math.random().toString(36).slice(2, 10);
        const expires = new Date(Date.now() + 2 * 3600 * 1000);
        let entity: PasswordResetToken;
        await this.repo.manager.transaction(async (manager) => {
            entity = manager.create(PasswordResetToken, { user_id, token, expires_at: expires });
            entity = await manager.save(entity);
        });
        return entity!;
    }
    async consume(token: string) {
        const rec = await this.repo.findOne({ where: { token } });
        if (!rec)
            throw new BadRequestException('Token noto‘g‘ri');
        if (rec.used_at)
            throw new BadRequestException('Token allaqachon ishlatilgan');
        if (rec.expires_at.getTime() < Date.now())
            throw new BadRequestException('Token muddati o‘tgan');
        await this.repo.manager.transaction(async (manager) => {
            rec.used_at = new Date();
            await manager.save(rec);
        });
        return rec;
    }
    async create(dto: {
        user_id: string;
    }) {
        return this.issue(dto.user_id);
    }
    async findAll() {
        return this.repo.find();
    }
    async findOne(id: number) {
        const rec = await this.repo.findOne({ where: { id: String(id) } });
        if (!rec)
            throw new NotFoundException('Token topilmadi');
        return rec;
    }
    async update(id: number, dto: Partial<PasswordResetToken>) {
        throw new ConflictException('Tokenni o‘zgartirish mumkin emas');
    }
    async remove(id: number) {
        const res = await this.repo.delete({ id: String(id) });
        if (!res.affected)
            throw new NotFoundException('Token topilmadi');
        return { success: true };
    }
}
