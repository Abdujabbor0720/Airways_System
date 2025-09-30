import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNumberString, IsOptional, IsString, Length, Matches } from 'class-validator';
export class CreateBookingDto {
    @ApiPropertyOptional({ description: 'User ID if logged in' })
    @IsOptional()
    @IsNumberString()
    user_id?: string;
    @ApiProperty({ enum: ['ONE_WAY', 'ROUND_TRIP', 'MULTI_CITY'] })
    @IsIn(['ONE_WAY', 'ROUND_TRIP', 'MULTI_CITY'])
    trip_type!: 'ONE_WAY' | 'ROUND_TRIP' | 'MULTI_CITY';
    @ApiPropertyOptional({ default: 'USD', minLength: 3, maxLength: 3 })
    @IsOptional()
    @IsString()
    @Length(3, 3)
    currency_code?: string;
    @ApiPropertyOptional({ description: 'Total fare (12,2 numeric as string)' })
    @IsOptional()
    @Matches(/^\d+(\.\d{1,2})?$/)
    fare_total?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    contact_email?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    contact_phone?: string;
}
