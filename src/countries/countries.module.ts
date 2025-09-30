import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Country } from './entities/country.entity';
import { City } from '../cities/entities/city.entity';
import { Airport } from '../airports/entities/airport.entity';
import { CitiesModule } from '../cities/cities.module';
@Module({
    imports: [TypeOrmModule.forFeature([Country, City, Airport]), CitiesModule],
    controllers: [CountriesController],
    providers: [CountriesService],
})
export class CountriesModule {
}
