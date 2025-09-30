import { PartialType } from '@nestjs/mapped-types';
import { CreateSupportMessageDto } from './create-support_message.dto';
export class UpdateSupportMessageDto extends PartialType(CreateSupportMessageDto) {
}
