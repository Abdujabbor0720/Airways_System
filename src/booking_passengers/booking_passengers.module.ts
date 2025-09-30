import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingPassengersService } from './booking_passengers.service';
import { BookingPassengersController } from './booking_passengers.controller';
import { BookingPassenger } from './entities/booking_passenger.entity';
import { Passenger } from '../passengers/entities/passenger.entity';
import { PassengersModule } from '../passengers/passengers.module';
import { Ticket } from '../tickets/entities/ticket.entity';
import { TicketsModule } from '../tickets/tickets.module';
import { SeatsModule } from '../seats/seats.module';
import { Seat } from '../seats/entities/seat.entity';
import { BaggageItemsModule } from '../baggage_items/baggage_items.module';
import { BaggageItem } from '../baggage_items/entities/baggage_item.entity';
@Module({
    imports: [TypeOrmModule.forFeature([BookingPassenger, Passenger, Ticket, Seat, BaggageItem]), PassengersModule, TicketsModule, SeatsModule, BaggageItemsModule],
    controllers: [BookingPassengersController],
    providers: [BookingPassengersService],
    exports: [BookingPassengersService],
})
export class BookingPassengersModule {
}
