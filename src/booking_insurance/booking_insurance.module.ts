import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingInsuranceService } from './booking_insurance.service';
import { BookingInsuranceController } from './booking_insurance.controller';
import { BookingInsurance } from './entities/booking_insurance.entity';
import { InsuranceProduct } from '../insurance_products/entities/insurance_product.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { InsuranceProductsModule } from '../insurance_products/insurance_products.module';
import { BookingsModule } from '../bookings/bookings.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([BookingInsurance, InsuranceProduct, Booking]),
        InsuranceProductsModule,
        BookingsModule,
    ],
    controllers: [BookingInsuranceController],
    providers: [BookingInsuranceService],
})
export class BookingInsuranceModule {
}
