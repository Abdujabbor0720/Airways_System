import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'user@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;
    @ApiPropertyOptional({ minLength: 8 })
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    full_name?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    birth_date?: string;
    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    loyalty_opt_in?: boolean;
    @ApiPropertyOptional({ enum: ['ACTIVE', 'BLOCKED', 'DELETED'], default: 'ACTIVE' })
    @IsOptional()
    @IsString()
    status?: 'ACTIVE' | 'BLOCKED' | 'DELETED';
}
