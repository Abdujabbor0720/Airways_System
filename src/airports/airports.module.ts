import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportsService } from './airports.service';
import { AirportsController } from './airports.controller';
import { Airport } from './entities/airport.entity';
import { City } from '../cities/entities/city.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Airport, City])],
    controllers: [AirportsController],
    providers: [AirportsService],
})
export class AirportsModule {
}
