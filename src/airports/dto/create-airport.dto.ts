import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, Length, Matches } from 'class-validator';
export class CreateAirportDto {
    @ApiProperty({ example: '1', description: 'City ID' })
    @IsNumberString()
    city_id!: string;
    @ApiPropertyOptional({ minLength: 3, maxLength: 3, example: 'TAS' })
    @IsOptional()
    @IsString()
    @Length(3, 3)
    @Matches(/^[A-Z]{3}$/)
    iata_code?: string;
    @ApiPropertyOptional({ minLength: 4, maxLength: 4, example: 'UTTT' })
    @IsOptional()
    @IsString()
    @Length(4, 4)
    @Matches(/^[A-Z0-9]{4}$/)
    icao_code?: string;
    @ApiProperty({ example: 'Tashkent International Airport' })
    @IsString()
    name!: string;
    @ApiPropertyOptional({ example: 41.2579 })
    @IsOptional()
    latitude?: number;
    @ApiPropertyOptional({ example: 69.2817 })
    @IsOptional()
    longitude?: number;
}
