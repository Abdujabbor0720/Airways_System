import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
export class CreateAirplaneModelDto {
    @ApiProperty()
    @IsString()
    manufacturer!: string;
    @ApiProperty()
    @IsString()
    model!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    icao_code?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    typical_range_km?: number;
}
