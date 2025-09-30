import { Inject, Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { REDIS } from '../common/redis/redis.module';
import type { Redis } from 'ioredis';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class NotificationsService {
    constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>, 
    @Inject(REDIS)
    private readonly redis: Redis) { }
    async create(dto: CreateNotificationDto) {
        if (!dto.channel || !['EMAIL', 'SMS', 'PUSH'].includes(dto.channel)) {
            throw new BadRequestException('Kanal noto‘g‘ri');
        }
        if (!dto.user_id && !dto.admin_user_id) {
            throw new BadRequestException('Oluvchi (user_id yoki admin_user_id) majburiy');
        }
        if (dto.channel === 'EMAIL') {
            if (!dto.to_address || !dto.subject) {
                throw new BadRequestException('EMAIL uchun to_address va subject majburiy');
            }
        }
        let notif: Notification;
        await this.repo.manager.transaction(async (manager) => {
            notif = manager.create(Notification, { ...dto, status: 'QUEUED' });
            notif = await manager.save(notif);
            await this.redis.lpush('notif:queue', notif.id);
        });
        return notif!;
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('n').skip(skip).take(take);
        applySorting(qb, 'n', { default: 'id', id: 'id', created_at: 'created_at', sent_at: 'sent_at', status: 'status' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Notification not found');
        return e;
    }
    async update(id: string, dto: UpdateNotificationDto) {
        const notif = await this.findOne(id);
        if (notif.status !== 'QUEUED') {
            throw new ConflictException('Yuborilgan yoki xatolik bo‘lgan xabarni o‘zgartirib bo‘lmaydi');
        }
        await this.repo.update({ id }, dto as QueryDeepPartialEntity<Notification>);
        return this.findOne(id);
    }
    async remove(id: string) {
        const notif = await this.findOne(id);
        if (notif.status !== 'QUEUED') {
            throw new ConflictException('Yuborilgan yoki xatolik bo‘lgan xabarni o‘chirish mumkin emas');
        }
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Notification not found');
        return { success: true };
    }
    async processNext() {
        const lockKey = 'notif:lock';
        const lock = await this.redis.set(lockKey, '1', 'EX', 10, 'NX');
        if (!lock) {
            throw new ConflictException('Worker allaqachon ishlamoqda');
        }
        try {
            const id = await this.redis.rpop('notif:queue');
            if (!id)
                return { processed: 0 };
            const notif = await this.findOne(String(id));
            let attempts = 0;
            let success = false;
            let lastError = '';
            while (attempts < 3 && !success) {
                attempts++;
                try {
                    notif.status = 'SENT';
                    notif.sent_at = new Date();
                    await this.repo.save(notif);
                    success = true;
                }
                catch (e: any) {
                    lastError = e?.message ?? 'Send failed';
                }
            }
            if (!success) {
                notif.status = 'FAILED';
                notif.error_message = lastError;
                await this.repo.save(notif);
                return { processed: 0, id: notif.id, error: notif.error_message };
            }
            return { processed: 1, id: notif.id };
        }
        finally {
            await this.redis.del(lockKey);
        }
    }
}
