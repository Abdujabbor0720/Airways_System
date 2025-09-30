import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightInstancesService } from './flight_instances.service';
import { FlightInstancesController } from './flight_instances.controller';
import { FlightInstance } from './entities/flight_instance.entity';
@Module({
    imports: [TypeOrmModule.forFeature([FlightInstance])],
    controllers: [FlightInstancesController],
    providers: [FlightInstancesService],
    exports: [FlightInstancesService],
})
export class FlightInstancesModule {
}
