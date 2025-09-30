import { ConflictException, Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateBookingInsuranceDto } from './dto/create-booking_insurance.dto';
import { UpdateBookingInsuranceDto } from './dto/update-booking_insurance.dto';
import { BookingInsurance } from './entities/booking_insurance.entity';
import { InsuranceProduct } from '../insurance_products/entities/insurance_product.entity';
import { Booking } from '../bookings/entities/booking.entity';
@Injectable()
export class BookingInsuranceService {
    constructor(
    @InjectRepository(BookingInsurance)
    private readonly repo: Repository<BookingInsurance>, 
    @InjectRepository(InsuranceProduct)
    private readonly productRepo: Repository<InsuranceProduct>, 
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>, private readonly dataSource: DataSource) { }
    async create(dto: CreateBookingInsuranceDto) {
        return this.dataSource.transaction(async (manager) => {
            const booking = await manager.findOne(Booking, { where: { id: dto.booking_id } });
            if (!booking)
                throw new NotFoundException('Booking topilmadi');
            const product = await manager.findOne(InsuranceProduct, { where: { id: dto.product_id } });
            if (!product)
                throw new NotFoundException('Insurance product topilmadi');
            const exists = await manager.findOne(BookingInsurance, {
                where: { booking_id: dto.booking_id, product_id: dto.product_id },
            });
            if (exists)
                throw new ConflictException('Bu booking uchun insurance allaqachon biriktirilgan');
            if (dto.valid_from && dto.valid_to && new Date(dto.valid_from) >= new Date(dto.valid_to)) {
                throw new BadRequestException('valid_from valid_to dan kichik bo‘lishi kerak');
            }
            const entity = manager.create(BookingInsurance, {
                booking_id: dto.booking_id,
                product_id: dto.product_id,
                policy_terms: dto.policy_terms ?? null,
                valid_from: dto.valid_from ? new Date(dto.valid_from) : null,
                valid_to: dto.valid_to ? new Date(dto.valid_to) : null,
                status: dto.status ?? 'ACTIVE',
            } as Partial<BookingInsurance>);
            try {
                return await manager.save(entity);
            }
            catch (e: any) {
                if (e?.code === '23505')
                    throw new ConflictException('Insurance already added for booking');
                throw e;
            }
        });
    }
    async findAll(skip = 0, take = 20) {
        return this.repo.findAndCount({ order: { id: 'DESC' }, skip, take });
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Booking insurance topilmadi');
        return e;
    }
    async update(id: string, dto: UpdateBookingInsuranceDto) {
        const insurance = await this.repo.findOne({ where: { id } });
        if (!insurance)
            throw new NotFoundException('Booking insurance topilmadi');
        if (insurance.status === 'EXPIRED' || insurance.status === 'CANCELLED') {
            throw new ForbiddenException('Expired yoki cancelled insurance o‘zgartirilmaydi');
        }
        await this.repo.update({ id }, {
            policy_terms: dto.policy_terms ?? insurance.policy_terms,
            status: dto.status ?? insurance.status,
        });
        return this.findOne(id);
    }
    async remove(id: string) {
        const insurance = await this.repo.findOne({ where: { id } });
        if (!insurance)
            throw new NotFoundException('Booking insurance topilmadi');
        if (insurance.status !== 'ACTIVE') {
            throw new ForbiddenException('Faqat ACTIVE insurance o‘chiriladi');
        }
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Booking insurance topilmadi');
        return { success: true };
    }
}
