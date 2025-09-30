import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { BookingPassenger } from '../booking_passengers/entities/booking_passenger.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Ticket, BookingPassenger])],
    controllers: [TicketsController],
    providers: [TicketsService],
    exports: [TicketsService],
})
export class TicketsModule {
}
