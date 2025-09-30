import { ConflictException, Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateBookingMealDto } from './dto/create-booking_meal.dto';
import { UpdateBookingMealDto } from './dto/update-booking_meal.dto';
import { BookingMeal } from './entities/booking_meal.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { applySorting } from '../common/utils/sort.util';
import { MealOption } from '../meal_options/entities/meal_option.entity';
import { Passenger } from '../passengers/entities/passenger.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
@Injectable()
export class BookingMealsService {
    constructor(
    @InjectRepository(BookingMeal)
    private readonly repo: Repository<BookingMeal>, 
    @InjectRepository(MealOption)
    private readonly mealRepo: Repository<MealOption>, 
    @InjectRepository(Passenger)
    private readonly passengerRepo: Repository<Passenger>, 
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>, private readonly dataSource: DataSource) { }
    async create(dto: CreateBookingMealDto) {
        return this.dataSource.transaction(async (manager) => {
            const passenger = await manager.findOne(Passenger, { where: { id: dto.passenger_id } });
            if (!passenger)
                throw new NotFoundException('Passenger topilmadi');
            const ticket = await manager.findOne(Ticket, { where: { booking_id: dto.booking_id, passenger_id: dto.passenger_id } });
            if (!ticket)
                throw new NotFoundException('Ticket topilmadi yoki passengerga tegishli emas');
            if (ticket.status !== 'ACTIVE')
                throw new ForbiddenException('Ticket faqat ACTIVE bo‘lsa, meal biriktiriladi');
            const meal = await manager.findOne(MealOption, { where: { id: dto.meal_option_id } });
            if (!meal)
                throw new NotFoundException('Meal option topilmadi');
            const exists = await manager.findOne(BookingMeal, {
                where: { booking_id: dto.booking_id, passenger_id: dto.passenger_id },
            });
            if (exists)
                throw new ConflictException('Bu passenger/ticket uchun meal allaqachon biriktirilgan');
            const entity = manager.create(BookingMeal, {
                booking_id: dto.booking_id,
                passenger_id: dto.passenger_id,
                meal_option_id: dto.meal_option_id,
                special_request: dto.special_request ?? null,
                dietary_constraint: dto.dietary_constraint ?? null,
            } as Partial<BookingMeal>);
            try {
                return await manager.save(entity);
            }
            catch (e: any) {
                if (e?.code === '23505')
                    throw new ConflictException('Meal already set for passenger in booking');
                throw e;
            }
        });
    }
    findAll(page: PaginationDto) {
        const take = Math.min(page.limit ?? 20, 100);
        const skip = page.offset ?? 0;
        const qb = this.repo.createQueryBuilder('bm').skip(skip).take(take);
        applySorting(qb, 'bm', { default: 'id', id: 'id' }, page.sort, page.order);
        return qb.getManyAndCount();
    }
    async findOne(id: string) {
        const e = await this.repo.findOne({ where: { id } });
        if (!e)
            throw new NotFoundException('Booking meal topilmadi');
        return e;
    }
    async update(id: string, dto: UpdateBookingMealDto) {
        const meal = await this.repo.findOne({ where: { id } });
        if (!meal)
            throw new NotFoundException('Booking meal topilmadi');
        await this.repo.update({ id }, {
            special_request: dto.special_request ?? meal.special_request,
            dietary_constraint: dto.dietary_constraint ?? meal.dietary_constraint,
        });
        return this.findOne(id);
    }
    async remove(id: string) {
        const meal = await this.repo.findOne({ where: { id } });
        if (!meal)
            throw new NotFoundException('Booking meal topilmadi');
        const ticket = await this.ticketRepo.findOne({ where: { booking_id: meal.booking_id, passenger_id: meal.passenger_id } });
        if (!ticket || ticket.status !== 'ACTIVE') {
            throw new ForbiddenException('Faqat ACTIVE ticket uchun meal o‘chiriladi');
        }
        const res = await this.repo.delete({ id });
        if (!res.affected)
            throw new NotFoundException('Booking meal topilmadi');
        return { success: true };
    }
}
