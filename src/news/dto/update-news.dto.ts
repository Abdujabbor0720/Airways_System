import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
export class UpdateNewsDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    title?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    slug?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    body?: string;
    @ApiPropertyOptional({ enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT' })
    @IsOptional()
    @IsIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}
