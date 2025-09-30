import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
export class CreateBookingInsuranceDto {
    @ApiProperty()
    @IsNumberString()
    booking_id!: string;
    @ApiProperty()
    @IsNumberString()
    product_id!: string;
    @ApiProperty({ required: false })
    policy_terms?: string;
    @ApiProperty({ required: false, type: String, format: 'date-time' })
    valid_from?: string;
    @ApiProperty({ required: false, type: String, format: 'date-time' })
    valid_to?: string;
    @ApiProperty({ required: false, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'], default: 'ACTIVE' })
    status?: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}
