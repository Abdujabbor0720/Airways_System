import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCityDto } from './create-city.dto';
export class UpdateCityDto extends PartialType(CreateCityDto) {
    @ApiPropertyOptional({ example: '1', description: 'Country ID' })
    country_id?: string;
    @ApiPropertyOptional({ example: 'Tashkent' })
    name?: string;
    @ApiPropertyOptional({ example: 'Asia/Tashkent' })
    timezone?: string;
}
