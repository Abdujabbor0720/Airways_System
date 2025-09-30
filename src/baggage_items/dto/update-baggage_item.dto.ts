import { PartialType } from '@nestjs/mapped-types';
import { CreateBaggageItemDto } from './create-baggage_item.dto';
export class UpdateBaggageItemDto extends PartialType(CreateBaggageItemDto) {
}
