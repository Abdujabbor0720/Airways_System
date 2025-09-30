import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingHistoryService } from './booking_history.service';
import { BookingHistoryController } from './booking_history.controller';
import { BookingHistory } from './entities/booking_history.entity';
@Module({
    imports: [TypeOrmModule.forFeature([BookingHistory])],
    controllers: [BookingHistoryController],
    providers: [BookingHistoryService],
    exports: [BookingHistoryService],
})
export class BookingHistoryModule {
}
