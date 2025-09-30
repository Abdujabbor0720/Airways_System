import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumberString, IsOptional, IsString, Length, Matches } from 'class-validator';
export class CreateAirlineDto {
    @ApiProperty()
    @IsString()
    name!: string;
    @ApiPropertyOptional({ minLength: 2, maxLength: 2 })
    @IsOptional()
    @IsString()
    @Length(2, 2)
    @Matches(/^[A-Z]{2}$/)
    iata_code?: string;
    @ApiPropertyOptional({ minLength: 3, maxLength: 3 })
    @IsOptional()
    @IsString()
    @Length(3, 3)
    @Matches(/^[A-Z0-9]{3}$/)
    icao_code?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    callsign?: string;
    @ApiPropertyOptional({ description: 'Country ID' })
    @IsOptional()
    @IsNumberString()
    country_id?: string;
    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
