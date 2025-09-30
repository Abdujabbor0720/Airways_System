import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
export class CreateNewsDto {
    @ApiProperty()
    @IsString()
    title!: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    slug?: string;
    @ApiProperty()
    @IsString()
    body!: string;
    @ApiPropertyOptional({ enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT' })
    @IsOptional()
    @IsIn(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}
