import { PartialType } from '@nestjs/mapped-types';
import { CreateSeatAssignmentDto } from './create-seat_assignment.dto';
export class UpdateSeatAssignmentDto extends PartialType(CreateSeatAssignmentDto) {
}
