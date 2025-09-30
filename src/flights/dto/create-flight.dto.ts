import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';
export class CreateFlightDto {
    @ApiProperty()
    @IsNumberString()
    airline_id!: string;
    @ApiProperty()
    @IsString()
    flight_number!: string;
    @ApiProperty()
    @IsNumberString()
    from_airport_id!: string;
    @ApiProperty()
    @IsNumberString()
    to_airport_id!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    scheduled_duration_minutes?: number;
    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
