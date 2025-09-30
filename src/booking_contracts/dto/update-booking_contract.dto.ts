import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingContractDto } from './create-booking_contract.dto';
export class UpdateBookingContractDto extends PartialType(CreateBookingContractDto) {
}
