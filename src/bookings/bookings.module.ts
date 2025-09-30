import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { BookingHistory } from '../booking_history/entities/booking_history.entity';
import { TicketsModule } from '../tickets/tickets.module';
import { BookingHistoryModule } from '../booking_history/booking_history.module';
@Module({
    imports: [TypeOrmModule.forFeature([Booking, BookingHistory]), TicketsModule, BookingHistoryModule],
    controllers: [BookingsController],
    providers: [BookingsService],
})
export class BookingsModule {
}
