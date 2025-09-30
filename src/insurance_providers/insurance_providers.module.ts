import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceProvidersService } from './insurance_providers.service';
import { InsuranceProvidersController } from './insurance_providers.controller';
import { InsuranceProvider } from './entities/insurance_provider.entity';
@Module({
    imports: [TypeOrmModule.forFeature([InsuranceProvider])],
    controllers: [InsuranceProvidersController],
    providers: [InsuranceProvidersService],
})
export class InsuranceProvidersModule {
}
