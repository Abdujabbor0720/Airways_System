import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { Translation } from './entities/translation.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
@Injectable()
export class TranslationsService {
    constructor(
    @InjectRepository(Translation)
    private readonly repo: Repository<Translation>) { }
    async create(dto: CreateTranslationDto) {
        if (!dto.entity_type || !dto.entity_id || !dto.lang_code || !dto.field || !dto.text) {
            throw new BadRequestException('Majburiy maydonlar to‘ldirilmagan');
        }
        const exists = await this.repo.findOne({
            where: {
                entity_type: dto.entity_type,
                entity_id: dto.entity_id,
                lang_code: dto.lang_code,
                field: dto.field,
            }
        });
        if (exists)
            throw new ConflictException('Bu kombinatsiya uchun tarjima allaqachon mavjud');
        let translation: Translation;
        await this.repo.manager.transaction(async (manager) => {
            translation = manager.create(Translation, dto);
            translation = await manager.save(translation);
        });
        return translation!;
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('t').skip(skip).take(take);
        applySorting(qb, 't', { default: 'id', id: 'id', lang_code: 'lang_code', field: 'field' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Translation not found');
        return e;
    }
    async update(id: string, dto: UpdateTranslationDto) {
        const translation = await this.findOne(id);
        if (!translation)
            throw new NotFoundException('Translation not found');
        const keys = ['entity_type', 'entity_id', 'lang_code', 'field'] as const;
        let changed = false;
        for (const k of keys) {
            if ((dto as any)[k] && (dto as any)[k] !== (translation as any)[k])
                changed = true;
        }
        if (changed) {
            const exists = await this.repo.findOne({
                where: {
                    entity_type: dto.entity_type ?? translation.entity_type,
                    entity_id: dto.entity_id ?? translation.entity_id,
                    lang_code: dto.lang_code ?? translation.lang_code,
                    field: dto.field ?? translation.field,
                }
            });
            if (exists && exists.id !== id)
                throw new ConflictException('Bu kombinatsiya uchun tarjima allaqachon mavjud');
        }
        const updated = await this.repo.manager.transaction(async (manager) => {
            await manager.update(Translation, { id }, dto as Partial<Translation>);
            const result = await manager.findOne(Translation, { where: { id } });
            if (!result)
                throw new NotFoundException('Translation not found after update');
            return result;
        });
        return updated;
    }
    async remove(id: string) {
        const translation = await this.findOne(id);
        if (!translation)
            throw new NotFoundException('Translation not found');
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Translation not found');
        return { success: true };
    }
}
