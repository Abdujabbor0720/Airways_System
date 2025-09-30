import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorporateContractsService } from './corporate_contracts.service';
import { CorporateContractsController } from './corporate_contracts.controller';
import { CorporateContract } from './entities/corporate_contract.entity';
import { Partner } from '../partners/entities/partner.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { PartnersModule } from '../partners/partners.module';
import { BookingsModule } from '../bookings/bookings.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([CorporateContract, Partner, Booking]),
        PartnersModule,
        BookingsModule,
    ],
    controllers: [CorporateContractsController],
    providers: [CorporateContractsService],
})
export class CorporateContractsModule {
}
