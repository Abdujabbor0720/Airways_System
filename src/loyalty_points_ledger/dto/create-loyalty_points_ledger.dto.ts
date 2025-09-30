import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';
export class CreateLoyaltyPointsLedgerDto {
    @ApiProperty()
    @IsNumberString()
    account_id!: string;
    @ApiProperty()
    @IsInt()
    delta_points!: number;
    @ApiProperty()
    @IsString()
    reason!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    related_booking_id?: string;
}
