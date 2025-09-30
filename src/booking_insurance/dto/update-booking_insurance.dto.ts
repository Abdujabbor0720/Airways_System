import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingInsuranceDto } from './create-booking_insurance.dto';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateBookingInsuranceDto extends PartialType(CreateBookingInsuranceDto) {
    @ApiProperty({ required: false })
    policy_terms?: string;
    @ApiProperty({ required: false, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'] })
    status?: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}
