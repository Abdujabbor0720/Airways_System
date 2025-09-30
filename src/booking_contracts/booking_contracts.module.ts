import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingContractsService } from './booking_contracts.service';
import { BookingContractsController } from './booking_contracts.controller';
import { BookingContract } from './entities/booking_contract.entity';
@Module({
    imports: [TypeOrmModule.forFeature([BookingContract])],
    controllers: [BookingContractsController],
    providers: [BookingContractsService],
})
export class BookingContractsModule {
}
