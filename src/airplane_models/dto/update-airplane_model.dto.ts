import { PartialType } from '@nestjs/mapped-types';
import { CreateAirplaneModelDto } from './create-airplane_model.dto';
export class UpdateAirplaneModelDto extends PartialType(CreateAirplaneModelDto) {
}
