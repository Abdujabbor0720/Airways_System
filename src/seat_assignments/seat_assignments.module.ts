import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatAssignmentsService } from './seat_assignments.service';
import { SeatAssignmentsController } from './seat_assignments.controller';
import { SeatAssignment } from './entities/seat_assignment.entity';
@Module({
    imports: [TypeOrmModule.forFeature([SeatAssignment])],
    controllers: [SeatAssignmentsController],
    providers: [SeatAssignmentsService],
})
export class SeatAssignmentsModule {
}
