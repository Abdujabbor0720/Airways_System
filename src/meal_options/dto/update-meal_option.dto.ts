import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class UpdateMealOptionDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    code?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;
}
