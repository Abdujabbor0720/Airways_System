import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
export class CreateCityDto {
    @ApiProperty({ example: '1', description: 'Country ID' })
    @IsNumberString()
    country_id!: string;
    @ApiProperty({ example: 'Tashkent' })
    @IsString()
    @IsNotEmpty()
    name!: string;
    @ApiPropertyOptional({ example: 'Asia/Tashkent' })
    @IsOptional()
    @IsString()
    timezone?: string;
}
