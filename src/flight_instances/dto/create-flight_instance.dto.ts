import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumberString, IsOptional, IsString } from 'class-validator';
export class CreateFlightInstanceDto {
    @ApiProperty()
    @IsNumberString()
    flight_id!: string;
    @ApiProperty()
    @IsDateString()
    departure_scheduled!: string;
    @ApiProperty()
    @IsDateString()
    arrival_scheduled!: string;
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
}
