import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaggageItemsService } from './baggage_items.service';
import { BaggageItemsController } from './baggage_items.controller';
import { BaggageItem } from './entities/baggage_item.entity';
import { TicketsCoupon } from '../tickets_coupons/entities/tickets_coupon.entity';
import { FareClass } from '../fare_classes/entities/fare_class.entity';
import { BaggagePolicy } from '../baggage_policies/entities/baggage_policy.entity';
import { TicketsCouponsModule } from '../tickets_coupons/tickets_coupons.module';
import { FareClassesModule } from '../fare_classes/fare_classes.module';
import { BaggagePoliciesModule } from '../baggage_policies/baggage_policies.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([BaggageItem, TicketsCoupon, FareClass, BaggagePolicy]),
        TicketsCouponsModule,
        FareClassesModule,
        BaggagePoliciesModule,
    ],
    controllers: [BaggageItemsController],
    providers: [BaggageItemsService],
})
export class BaggageItemsModule {
}
