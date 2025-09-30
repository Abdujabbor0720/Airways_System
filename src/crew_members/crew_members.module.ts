import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewMembersService } from './crew_members.service';
import { CrewMembersController } from './crew_members.controller';
import { CrewMember } from './entities/crew_member.entity';
import { Airline } from '../airlines/entities/airline.entity';
import { FlightCrew } from '../flight_crews/entities/flight_crew.entity';
import { AirlinesModule } from '../airlines/airlines.module';
import { FlightCrewsModule } from '../flight_crews/flight_crews.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([CrewMember, Airline, FlightCrew]),
        AirlinesModule,
        FlightCrewsModule,
    ],
    controllers: [CrewMembersController],
    providers: [CrewMembersService],
})
export class CrewMembersModule {
}
