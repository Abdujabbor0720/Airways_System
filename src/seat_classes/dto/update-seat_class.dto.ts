import { PartialType } from '@nestjs/mapped-types';
import { CreateSeatClassDto } from './create-seat_class.dto';
export class UpdateSeatClassDto extends PartialType(CreateSeatClassDto) {
}
