import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FlightInstance } from '../flight_instances/entities/flight_instance.entity';
import { Seat } from '../seats/entities/seat.entity';
import { TicketsCoupon } from '../tickets_coupons/entities/tickets_coupon.entity';
import { CreateSeatAssignmentDto } from './dto/create-seat_assignment.dto';
import { UpdateSeatAssignmentDto } from './dto/update-seat_assignment.dto';
import { SeatAssignment } from './entities/seat_assignment.entity';
@Injectable()
export class SeatAssignmentsService {
    constructor(
    @InjectRepository(SeatAssignment)
    private readonly repo: Repository<SeatAssignment>, private readonly dataSource: DataSource) { }
    async create(dto: CreateSeatAssignmentDto) {
        if (!dto.flight_instance_id || !dto.seat_id || !dto.ticket_coupon_id) {
            throw new BadRequestException('flight_instance_id, seat_id, ticket_coupon_id majburiy');
        }
        return this.dataSource.transaction(async (manager) => {
            const k1 = Number(dto.flight_instance_id) % 2147483647;
            const k2 = Number(dto.seat_id) % 2147483647;
            await manager.query('SELECT pg_advisory_xact_lock($1::int, $2::int)', [k1, k2]);
            const fi = await manager.findOne(FlightInstance, { where: { id: dto.flight_instance_id } });
            if (!fi)
                throw new NotFoundException('Flight instance not found');
            const coupon = await manager.findOne(TicketsCoupon, { where: { id: dto.ticket_coupon_id } });
            if (!coupon)
                throw new NotFoundException('Ticket coupon not found');
            if (coupon.flight_instance_id !== dto.flight_instance_id) {
                throw new BadRequestException('Coupon not valid for this flight instance');
            }
            const seat = await manager.findOne(Seat, { where: { id: dto.seat_id } });
            if (!seat)
                throw new NotFoundException('Seat not found');
            if (!fi.plane_id) {
                throw new BadRequestException('Flight instance plane not assigned');
            }
            if (seat.plane_id !== fi.plane_id) {
                throw new BadRequestException('Seat does not belong to the flight instance plane');
            }
            if (seat.blocked)
                throw new ConflictException('Seat is blocked');
            const exists = await manager.findOne(SeatAssignment, { where: { flight_instance_id: dto.flight_instance_id, seat_id: dto.seat_id } });
            if (exists)
                throw new ConflictException('Seat already assigned for this flight instance');
            const couponExists = await manager.findOne(SeatAssignment, { where: { ticket_coupon_id: dto.ticket_coupon_id } });
            if (couponExists)
                throw new ConflictException('Coupon already used for seat assignment');
            try {
                const entity = manager.create(SeatAssignment, dto as Partial<SeatAssignment>);
                return await manager.save(entity);
            }
            catch (e: any) {
                if (e?.code === '23505')
                    throw new ConflictException('Seat already assigned or coupon in use');
                throw e;
            }
        });
    }
    findAll(skip = 0, take = 20) {
        return this.repo.findAndCount({ order: { assigned_at: 'DESC' }, skip, take });
    }
    async findOne(id: string) {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity)
            throw new NotFoundException('Seat assignment not found');
        return entity;
    }
    async update(id: string, dto: UpdateSeatAssignmentDto) {
        throw new ConflictException('Seat assignmentni o‘zgartirish mumkin emas');
    }
    async remove(id: string) {
        throw new ConflictException('Seat assignmentni o‘chirish mumkin emas');
    }
}
