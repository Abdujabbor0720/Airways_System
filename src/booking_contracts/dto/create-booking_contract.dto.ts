import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsDateString, IsString, IsIn } from 'class-validator';
export class CreateBookingContractDto {
    @ApiProperty()
    @IsNumberString()
    booking_id!: string;
    @ApiProperty()
    @IsNumberString()
    contract_id!: string;
    @ApiProperty({ type: String, format: 'date-time' })
    @IsDateString()
    valid_from!: string;
    @ApiProperty({ type: String, format: 'date-time' })
    @IsDateString()
    valid_to!: string;
    @ApiProperty({ minLength: 10 })
    @IsString()
    terms!: string;
    @ApiProperty({ enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'] })
    @IsIn(['ACTIVE', 'EXPIRED', 'CANCELLED'])
    status!: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}
