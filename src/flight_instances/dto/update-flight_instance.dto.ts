import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumberString, IsOptional, IsString } from 'class-validator';
export class UpdateFlightInstanceDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    flight_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    departure_scheduled?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    arrival_scheduled?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    plane_id?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    terminal_departure?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    gate_departure?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    terminal_arrival?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    gate_arrival?: string;
    @ApiPropertyOptional({ enum: ['SCHEDULED', 'DELAYED', 'CANCELLED', 'DEPARTED', 'ARRIVED'] })
    @IsOptional()
    @IsString()
    status?: 'SCHEDULED' | 'DELAYED' | 'CANCELLED' | 'DEPARTED' | 'ARRIVED';
}
