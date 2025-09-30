import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { Flight } from './entities/flight.entity';
import { FlightInstance } from '../flight_instances/entities/flight_instance.entity';
import { Airport } from '../airports/entities/airport.entity';
import { FlightInstancesModule } from '../flight_instances/flight_instances.module';
import { UserSearchHistoryModule } from '../user_search_history/user_search_history.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([Flight, FlightInstance, Airport]),
        FlightInstancesModule,
        UserSearchHistoryModule,
    ],
    controllers: [FlightsController],
    providers: [FlightsService],
})
export class FlightsModule {
}
