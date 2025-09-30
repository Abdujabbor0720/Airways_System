import { PartialType } from '@nestjs/mapped-types';
import { CreateBaggagePolicyDto } from './create-baggage_policy.dto';
export class UpdateBaggagePolicyDto extends PartialType(CreateBaggagePolicyDto) {
}
