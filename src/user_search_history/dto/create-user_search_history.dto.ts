import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumberString, IsOptional } from 'class-validator';
export class CreateUserSearchHistoryDto {
    @ApiPropertyOptional({ description: 'User ID' })
    @IsOptional()
    @IsNumberString()
    user_id?: string;
    @ApiPropertyOptional({ description: 'Origin airport ID' })
    @IsOptional()
    @IsNumberString()
    origin_airport_id?: string;
    @ApiPropertyOptional({ description: 'Destination airport ID' })
    @IsOptional()
    @IsNumberString()
    destination_airport_id?: string;
    @ApiProperty()
    @IsDateString()
    depart_date!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    return_date?: string;
    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @IsInt()
    adults?: number;
    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @IsInt()
    children?: number;
    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @IsInt()
    infants?: number;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    cabin_class_id?: string;
}
