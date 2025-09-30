import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
export class PaginationDto {
    @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;
    @ApiPropertyOptional({ default: 1, minimum: 1, description: '1-based page number' })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;
    @ApiPropertyOptional({ default: 0, minimum: 0, deprecated: true, description: 'Deprecated. Prefer page instead.' })
    @IsOptional()
    @IsInt()
    @Min(0)
    offset?: number = 0;
    @ApiPropertyOptional({ description: 'Sort field' })
    @IsOptional()
    @IsString()
    sort?: string;
    @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'ASC' })
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order?: 'ASC' | 'DESC' = 'ASC';
}
