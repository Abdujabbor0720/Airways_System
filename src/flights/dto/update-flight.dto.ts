import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';
export class UpdateFlightDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    airline_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    flight_number?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    from_airport_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    to_airport_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    scheduled_duration_minutes?: number;
    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
