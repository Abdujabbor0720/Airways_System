import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceProductsService } from './insurance_products.service';
import { InsuranceProductsController } from './insurance_products.controller';
import { InsuranceProduct } from './entities/insurance_product.entity';
@Module({
    imports: [TypeOrmModule.forFeature([InsuranceProduct])],
    controllers: [InsuranceProductsController],
    providers: [InsuranceProductsService],
})
export class InsuranceProductsModule {
}
