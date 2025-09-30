import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsCouponsService } from './tickets_coupons.service';
import { TicketsCouponsController } from './tickets_coupons.controller';
import { TicketsCoupon } from './entities/tickets_coupon.entity';
@Module({
    imports: [TypeOrmModule.forFeature([TicketsCoupon])],
    controllers: [TicketsCouponsController],
    providers: [TicketsCouponsService],
})
export class TicketsCouponsModule {
}
