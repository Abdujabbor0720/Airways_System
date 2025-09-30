import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightCrewsService } from './flight_crews.service';
import { FlightCrewsController } from './flight_crews.controller';
import { FlightCrew } from './entities/flight_crew.entity';
@Module({
    imports: [TypeOrmModule.forFeature([FlightCrew])],
    controllers: [FlightCrewsController],
    providers: [FlightCrewsService],
})
export class FlightCrewsModule {
}
